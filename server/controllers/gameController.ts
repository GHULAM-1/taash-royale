import { Request, Response } from 'express';
import Game from '../models/Game';
import User from '../models/User';
import { connectDB } from '../utils/db';
import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const STREAM_API_KEY = process.env.STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

function generateRoomCode() {
  return Math.random().toString(36).substr(2, 16);
}

export const createRoom = async (req: any, res: any) => {
  await connectDB();
  const { creator, maxPlayers } = req.body;
  if (!creator) return res.status(400).json({ error: 'creator is required' });

  // Fetch creator username
  const creatorUser = await User.findOne({ id: creator });
  const creatorObj = creatorUser ? { id: creatorUser.id, username: creatorUser.username } : { id: creator, username: creator };

  const code = generateRoomCode();

  // Create Stream channel with created_by_id
  const channel = serverClient.channel('messaging', code, {
    members: [creator],
    created_by_id: creator,
    maxPlayers,
  });
  await channel.create();

  // Store in MongoDB (as gameInfo)
  const gameInfo = {
    code,
    creator,
    maxPlayers,
    users: [creatorObj],
    pendingInvites: [],
    status: 'waiting_for_invites',
  };
  const game = await Game.create({ gameInfo });
  return res.json({ code, game });
};

export const joinRoom = async (req: any, res: any) => {
  const { code, userId } = req.body;
  if (!code || !userId) return res.status(400).json({ error: 'code and userId required' });
  await connectDB();
  const game = await Game.findOne({ 'gameInfo.code': code });
  if (!game) return res.status(404).json({ error: 'Room not found' });
  // Fetch joining user username
  const joinUser = await User.findOne({ id: userId });
  const joinObj = joinUser ? { id: joinUser.id, username: joinUser.username } : { id: userId, username: userId };
  // Add user to gameInfo.users if not already
  if (!game.gameInfo.users.some((u: any) => (u.id || u) === userId)) {
    game.gameInfo.users.push(joinObj);
    await game.save();
  }
  // Add user to Stream channel
  try {
    await serverClient.upsertUser({ id: userId, name: userId });
    const channel = serverClient.channel('messaging', code, { created_by_id: game.gameInfo.creator });
    await channel.create().catch((err) => {
      if (err.response?.data?.code !== 16) throw err;
    });
    await channel.addMembers([userId]).catch((err) => {
      if (err.response?.data?.code !== 16) throw err;
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add user to Stream channel' });
  }
  return res.json({ game });
};

export const getRoom = async (req: any, res: any) => {
  const { code } = req.params;
  if (!code) return res.status(400).json({ error: 'Room code required' });
  await connectDB();
  const game = await Game.findOne({ 'gameInfo.code': code });
  if (!game) return res.status(404).json({ error: 'Room not found' });
  return res.json({ game });
};

export const inviteToRoom = async (req: any, res: any) => {
  const { code, invitees } = req.body;
  if (!code || !invitees || !Array.isArray(invitees)) return res.status(400).json({ error: 'code and invitees required' });
  await connectDB();
  const game = await Game.findOne({ 'gameInfo.code': code });
  if (!game) return res.status(404).json({ error: 'Room not found' });

  if (!Array.isArray(game.gameInfo.pendingInvites)) {
    game.gameInfo.pendingInvites = [];
  }

  invitees.forEach(inv => {
    if (!inv.id && inv._id) inv.id = inv._id;
    if (!game.gameInfo.pendingInvites.some((u: any) => u.id === inv.id)) {
      game.gameInfo.pendingInvites.push({ id: inv.id, username: inv.username });
    }
  });

  game.markModified('gameInfo.pendingInvites');

  await game.save();
  return res.json({ game });
};

export const acceptInvite = async (req: any, res: any) => {
  const { code, userId } = req.body;
  if (!code || !userId) return res.status(400).json({ error: 'code and userId required' });
  await connectDB();
  const game = await Game.findOne({ 'gameInfo.code': code });
  if (!game) return res.status(404).json({ error: 'Room not found' });
  // Find invitee in pendingInvites
  const idx = game.gameInfo.pendingInvites.findIndex((u: any) => u.id === userId);
  if (idx === -1) return res.status(400).json({ error: 'No pending invite for this user' });
  const invitee = game.gameInfo.pendingInvites[idx];
  // Move invitee to users
  if (!game.gameInfo.users.some((u: any) => u.id === userId)) {
    game.gameInfo.users.push(invitee);
  }
  game.gameInfo.pendingInvites.splice(idx, 1);
  // If all invites accepted, set status to 'ready'
  if (game.gameInfo.pendingInvites.length === 0) {
    game.gameInfo.status = 'ready';
  }
  await game.save();
  // TODO: Emit real-time notification here
  return res.json({ game });
};

export const getPendingInvites = async (req: any, res: any) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  await connectDB();
  
  try {
    const games = await Game.find({
      'gameInfo.pendingInvites.id': userId
    }).select('gameInfo.code gameInfo.creator gameInfo.maxPlayers gameInfo.pendingInvites');
    const pendingInvites = games.map(game => ({
      roomCode: game.gameInfo.code,
      creator: game.gameInfo.creator,
      maxPlayers: game.gameInfo.maxPlayers,
      invite: game.gameInfo.pendingInvites.find((u: any) => u.id === userId)
    }));
    
    return res.json({ pendingInvites });
  } catch (error) {
    console.error('Error fetching pending invites:', error);
    return res.status(500).json({ error: 'Failed to fetch pending invites' });
  }
};


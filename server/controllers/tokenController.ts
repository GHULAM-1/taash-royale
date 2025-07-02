import { Request, Response } from 'express';
import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const STREAM_API_KEY = process.env.STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const getToken = async (req: any, res: any) => {
  const { userId, roomCode } = req.body;
  if (!userId || !roomCode) return res.status(400).json({ error: 'userId and roomCode required' });
  try {
    // Ensure user exists in Stream
    await serverClient.upsertUser({ id: userId, name: userId });
    // Create or fetch the room channel
    const channel = serverClient.channel('messaging', roomCode, { created_by_id: userId });
    await channel.create().catch((err) => {
      if (err.response?.data?.code !== 16) throw err; // Ignore 'already exists'
    });
    // Add user as member
    await channel.addMembers([userId]).catch((err) => {
      if (err.response?.data?.code !== 16) throw err;
    });
    // Create token
    const token = serverClient.createToken(userId);
    res.json({ token });
  } catch (error) {
    console.error('Error adding user to room or creating token:', error);
    res.status(500).json({ error: 'Failed to add user to room or create token' });
  }
}; 
import express from 'express';
import { createRoom, joinRoom, getRoom, inviteToRoom, acceptInvite, getPendingInvites } from '../controllers/roomController';

const router = express.Router();

router.post('/api/rooms', createRoom);
router.post('/api/rooms/join', joinRoom);
router.get('/api/rooms/:code', getRoom);
router.post('/api/rooms/invite', inviteToRoom);
router.post('/api/rooms/accept-invite', acceptInvite);
router.get('/api/rooms/pending-invites/:userId', getPendingInvites);

export default router; 
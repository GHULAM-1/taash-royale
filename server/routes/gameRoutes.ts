import express from 'express';
import { createRoom, joinRoom, getRoom, inviteToRoom, acceptInvite, getPendingInvites } from '../controllers/gameController';

const router = express.Router();

router.post('/api/games', createRoom);
router.post('/api/games/join', joinRoom);
router.get('/api/games/:code', getRoom);
router.post('/api/games/invite', inviteToRoom);
router.post('/api/games/accept-invite', acceptInvite);
router.get('/api/games/pending-invites/:userId', getPendingInvites);

export default router; 
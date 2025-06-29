import express from 'express';
import { createUserToken } from '../controllers/chatController';

const router = express.Router();

router.post('/token', createUserToken);

export default router; 
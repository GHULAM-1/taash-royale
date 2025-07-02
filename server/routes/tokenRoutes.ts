import express from 'express';
import { getToken } from '../controllers/tokenController';

const router = express.Router();
router.post('/api/token', getToken);
export default router; 
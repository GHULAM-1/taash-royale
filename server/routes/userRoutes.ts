import { createUser, getMockUsers } from '../controllers/userController';
import { Router } from 'express';

const router = Router();

router.post('/api/users', createUser);
router.get('/api/mock-users', getMockUsers);

export default router; 
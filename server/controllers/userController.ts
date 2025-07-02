import User from '../models/User';
import { connectDB } from '../utils/db';

export const createUser = async (req: any, res: any) => {
  await connectDB();
  const { id, username } = req.body;
  if (!id || !username) {
    return res.status(400).json({ error: 'id and username are required' });
  }
  console.log("Creating user", id, username);
  let user = await User.findOne({ id });
  if (!user) {
    user = await User.create({ id, username });
  }
  return res.json(user);
};

export const getMockUsers = async (req: any, res: any) => {
  await connectDB();
  const limit = parseInt(req.query.limit) || 10;
  const excludeUserId = req.query.exclude;
  
  try {
    let query = {};
    if (excludeUserId) {
      query = { id: { $ne: excludeUserId } };
    }
    
    const users = await User.find(query)
      .limit(limit)
      .select('id username')
      .sort({ createdAt: -1 });
    
    return res.json(users);
  } catch (error) {
    console.error('Error fetching mock users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}; 
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
    // Fetch all existing users
    const existingUsers = await User.find({});
    // Create the new user with userFriends = all existing users
    user = await User.create({
      id,
      username,
      userFriends: existingUsers.map(u => ({ userId: u._id, status: 'view' }))
    });
    // Add the new user to all existing users' userFriends
    await Promise.all(existingUsers.map(async (u) => {
      // Only add if not already present
      if (!u.userFriends.some((f: any) => String(f.userId) === String(user._id))) {
        u.userFriends.push({ userId: user._id, status: 'view' });
        await u.save();
      }
    }));
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
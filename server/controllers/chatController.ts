import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const createUserToken = async (req: any, res: any) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    // Ensure user is registered with Stream
    await serverClient.upsertUser({
      id: userId,
      name: userId,
    });

    // Create or fetch the "global-chat" channel
    const channel = serverClient.channel('messaging', 'global-chat', {
      created_by_id: userId,
    });

    await channel.create().catch((err) => {
      if (err.response?.data?.code !== 16) throw err; // Ignore "already exists"
    });

    // Add the user as a member of the channel
    await channel.addMembers([userId]).catch((err) => {
      if (err.response?.data?.code !== 16) throw err; // Ignore duplicate member error
    });

    // Create a token
    const token = serverClient.createToken(userId);

    res.json({ token });
  } catch (error) {
    console.error('Error adding user to channel or creating token:', error);
    res.status(500).json({ error: 'Failed to add user to channel or create token' });
  }
};

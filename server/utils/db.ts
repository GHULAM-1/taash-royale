import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taash-royale';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, {
    dbName: 'taash-royale-db',
  });
  console.log('Connected to MongoDB');
};
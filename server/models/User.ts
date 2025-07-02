import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MockUser || mongoose.model('mock-users', userSchema); 
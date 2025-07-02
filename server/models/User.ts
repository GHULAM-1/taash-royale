import mongoose from 'mongoose';

const userFriendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'mock-users', required: true },
  status: { type: String, enum: ['request-received', 'request-sent', 'view'], default: 'view' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  userFriends: [userFriendSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MockUser || mongoose.model('mock-users', userSchema, 'mock-user'); 
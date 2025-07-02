import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  maxPlayers: { type: Number, required: true },
  users: [
    {
      id: { type: String, required: true },
      username: { type: String, required: true }
    }
  ],
  pendingInvites: [
    {
      id: { type: String, required: true },
      username: { type: String, required: true }
    }
  ],
  status: { type: String, default: 'waiting_for_invites' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema); 
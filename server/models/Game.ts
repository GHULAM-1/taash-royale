import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  gameInfo: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Game || mongoose.model('Game', gameSchema, 'game'); 
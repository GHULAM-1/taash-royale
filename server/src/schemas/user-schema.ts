import mongoose, { model } from 'mongoose';

mongoose.pluralize(null);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    rank: { 
      type: String, 
      required: true,
      enum: ['beginner', 'master', 'expert', 'legend'],
      default: 'beginner'
    },
    totalTrophies: { 
      type: Number, 
      required: true,
      min: 0,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', UserSchema);

export default User;
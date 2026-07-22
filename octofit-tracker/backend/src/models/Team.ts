import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, trim: true },
    memberCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;

import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    focusArea: {
      type: String,
      enum: ['cardio', 'strength', 'mobility', 'recovery'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    estimatedMinutes: { type: Number, required: true, min: 5 },
    exercises: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

export default Workout;

import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Maya Chen',
        email: 'maya.chen@octofit.test',
        fitnessLevel: 'intermediate',
        weeklyGoalMinutes: 210,
      },
      {
        name: 'Leo Alvarez',
        email: 'leo.alvarez@octofit.test',
        fitnessLevel: 'advanced',
        weeklyGoalMinutes: 300,
      },
      {
        name: 'Nina Patel',
        email: 'nina.patel@octofit.test',
        fitnessLevel: 'beginner',
        weeklyGoalMinutes: 150,
      },
    ]);

    await Team.insertMany([
      {
        name: 'Harbor Hustlers',
        city: 'Seattle',
        motto: 'Consistency over intensity',
        memberCount: 12,
      },
      {
        name: 'Summit Sprinters',
        city: 'Denver',
        motto: 'Higher every week',
        memberCount: 9,
      },
    ]);

    await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'run',
        durationMinutes: 42,
        caloriesBurned: 430,
        completedAt: new Date('2026-07-20T06:30:00.000Z'),
      },
      {
        userId: users[1]._id,
        type: 'cycle',
        durationMinutes: 55,
        caloriesBurned: 610,
        completedAt: new Date('2026-07-20T17:10:00.000Z'),
      },
      {
        userId: users[2]._id,
        type: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 180,
        completedAt: new Date('2026-07-21T07:15:00.000Z'),
      },
      {
        userId: users[0]._id,
        type: 'strength',
        durationMinutes: 48,
        caloriesBurned: 390,
        completedAt: new Date('2026-07-21T18:05:00.000Z'),
      },
    ]);

    await Leaderboard.insertMany([
      {
        userId: users[1]._id,
        points: 960,
        rank: 1,
        weekStart: new Date('2026-07-20T00:00:00.000Z'),
      },
      {
        userId: users[0]._id,
        points: 870,
        rank: 2,
        weekStart: new Date('2026-07-20T00:00:00.000Z'),
      },
      {
        userId: users[2]._id,
        points: 610,
        rank: 3,
        weekStart: new Date('2026-07-20T00:00:00.000Z'),
      },
    ]);

    await Workout.insertMany([
      {
        title: '30-Min HIIT Burn',
        focusArea: 'cardio',
        difficulty: 'advanced',
        estimatedMinutes: 30,
        exercises: ['Jump squats', 'Burpees', 'Mountain climbers', 'High knees'],
      },
      {
        title: 'Foundational Strength Circuit',
        focusArea: 'strength',
        difficulty: 'beginner',
        estimatedMinutes: 40,
        exercises: ['Bodyweight squats', 'Push-ups', 'Glute bridges', 'Plank'],
      },
      {
        title: 'Mobility Reset Flow',
        focusArea: 'mobility',
        difficulty: 'intermediate',
        estimatedMinutes: 25,
        exercises: ['World\'s greatest stretch', 'Hip openers', 'Thoracic rotations'],
      },
    ]);

    console.log('Seed the octofit_db database with test data');
    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

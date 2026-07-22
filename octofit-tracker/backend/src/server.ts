import express from 'express';
import db from './config/database';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const apiBaseUrl = `${baseUrl}/api`;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get('/api/users/', async (_req, res) => {
  const users = await User.find().sort({ name: 1 }).lean();
  res.json({ endpoint: `${apiBaseUrl}/users/`, count: users.length, users });
});

app.get('/api/teams/', async (_req, res) => {
  const teams = await Team.find().sort({ name: 1 }).lean();
  res.json({ endpoint: `${apiBaseUrl}/teams/`, count: teams.length, teams });
});

app.get('/api/activities/', async (_req, res) => {
  const activities = await Activity.find().sort({ completedAt: -1 }).populate('userId', 'name email').lean();
  res.json({ endpoint: `${apiBaseUrl}/activities/`, count: activities.length, activities });
});

app.get('/api/leaderboard/', async (_req, res) => {
  const leaderboard = await Leaderboard.find()
    .sort({ rank: 1 })
    .populate('userId', 'name email fitnessLevel')
    .lean();
  res.json({ endpoint: `${apiBaseUrl}/leaderboard/`, count: leaderboard.length, leaderboard });
});

app.get('/api/workouts/', async (_req, res) => {
  const workouts = await Workout.find().sort({ estimatedMinutes: 1 }).lean();
  res.json({ endpoint: `${apiBaseUrl}/workouts/`, count: workouts.length, workouts });
});

export function startServer(): void {
  db.once('open', () => {
    app.listen(port, () => {
      console.log(`OctoFit backend listening on ${baseUrl}`);
      console.log(`API base URL: ${apiBaseUrl}`);
    });
  });
}

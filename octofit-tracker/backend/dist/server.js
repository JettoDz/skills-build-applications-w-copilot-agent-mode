"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const Activity_1 = __importDefault(require("./models/Activity"));
const Leaderboard_1 = __importDefault(require("./models/Leaderboard"));
const Team_1 = __importDefault(require("./models/Team"));
const User_1 = __importDefault(require("./models/User"));
const Workout_1 = __importDefault(require("./models/Workout"));
const app = (0, express_1.default)();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
const apiBaseUrl = `${baseUrl}/api`;
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl });
});
app.get('/api/users/', async (_req, res) => {
    const users = await User_1.default.find().sort({ name: 1 }).lean();
    res.json({ endpoint: `${apiBaseUrl}/users/`, count: users.length, users });
});
app.get('/api/teams/', async (_req, res) => {
    const teams = await Team_1.default.find().sort({ name: 1 }).lean();
    res.json({ endpoint: `${apiBaseUrl}/teams/`, count: teams.length, teams });
});
app.get('/api/activities/', async (_req, res) => {
    const activities = await Activity_1.default.find().sort({ completedAt: -1 }).populate('userId', 'name email').lean();
    res.json({ endpoint: `${apiBaseUrl}/activities/`, count: activities.length, activities });
});
app.get('/api/leaderboard/', async (_req, res) => {
    const leaderboard = await Leaderboard_1.default.find()
        .sort({ rank: 1 })
        .populate('userId', 'name email fitnessLevel')
        .lean();
    res.json({ endpoint: `${apiBaseUrl}/leaderboard/`, count: leaderboard.length, leaderboard });
});
app.get('/api/workouts/', async (_req, res) => {
    const workouts = await Workout_1.default.find().sort({ estimatedMinutes: 1 }).lean();
    res.json({ endpoint: `${apiBaseUrl}/workouts/`, count: workouts.length, workouts });
});
function startServer() {
    database_1.default.once('open', () => {
        app.listen(port, () => {
            console.log(`OctoFit backend listening on ${baseUrl}`);
            console.log(`API base URL: ${apiBaseUrl}`);
        });
    });
}

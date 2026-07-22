"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workoutSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const Workout = mongoose_1.default.models.Workout || mongoose_1.default.model('Workout', workoutSchema);
exports.default = Workout;

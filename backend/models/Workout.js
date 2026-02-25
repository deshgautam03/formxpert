const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g., 'squat', 'pushup'
    reps: { type: Number, default: 0 },
    accuracyScore: { type: Number, default: 0 }, // Average accuracy
    duration: { type: Number, default: 0 }, // in seconds
    mistakes: [{ type: String }], // Array of mistake strings
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', WorkoutSchema);

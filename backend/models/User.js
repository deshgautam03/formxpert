const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: { type: String, default: '' },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

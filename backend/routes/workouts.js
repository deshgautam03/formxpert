const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const User = require('../models/User');

// Save Workout
router.post('/', auth, async (req, res) => {
    try {
        const { type, reps, accuracyScore, duration, mistakes } = req.body;

        // Create new workout
        const newWorkout = new Workout({
            user: req.user.id,
            type,
            reps,
            accuracyScore,
            duration,
            mistakes
        });

        const workout = await newWorkout.save();

        // Update User Streak
        const user = await User.findById(req.user.id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let lastWorkout = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
        if (lastWorkout) lastWorkout.setHours(0, 0, 0, 0);

        if (!lastWorkout) {
            // First workout ever
            user.currentStreak = 1;
        } else {
            const diffTime = Math.abs(today - lastWorkout);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                user.currentStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                user.currentStreak = 1;
            }
            // If diffDays === 0, do nothing (already worked out today)
        }

        if (user.currentStreak > user.bestStreak) {
            user.bestStreak = user.currentStreak;
        }

        user.lastWorkoutDate = Date.now();
        await user.save();

        res.json({ workout, streak: user.currentStreak });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get User Workouts
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

# FormXpert - AI Gym Assistant

FormXpert is a full-stack web application that uses AI to correct your exercise form in real-time. It features a modern gym-themed UI, streak tracking, analytics, and robust authentication.

## Features

- **Real-time Posture Correction**: Uses **MediaPipe BlazePose** (33 keypoints) for high-accuracy full-body tracking.
- **Advanced Rep Counting**: State-machine based logic for Squats, Pushups, and Shoulder Presses to prevent false positives.
- **Audio Feedback**: Intelligent audio cues with cooldowns to correct your form without spamming.
- **Streak System**: Tracks your daily workout streaks to keep you motivated.
- **Analytics Dashboard**: Visualizes your progress, accuracy, and rep counts over time.
- **Secure Authentication**: JWT-based auth with protected routes.
- **Modern UI**: Responsive design with parallax effects and glassmorphism.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI/ML**: TensorFlow.js, MediaPipe BlazePose.

## Pose Detection System

The project uses a modular architecture for pose detection located in `frontend/lib/pose`:

- `poseService.ts`: Handles BlazePose initialization and webcam stream.
- `exerciseLogic.ts`: Contains state machines for each exercise (Squat, Pushup, etc.).
- `postureRules.ts`: Defines biomechanical rules for feedback.
- `audioService.ts`: Manages text-to-speech with prioritization and cooldowns.

### Adding New Exercises

1.  Create a new class in `exerciseLogic.ts` extending `ExerciseLogic`.
2.  Define the state machine and angle thresholds.
3.  Add specific feedback rules in `postureRules.ts`.
4.  Update `PoseDetector.tsx` to instantiate the new logic.

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (see `.env.example`) and add your MongoDB URI and JWT Secret.
4.  Start the server:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    App runs on `http://localhost:3000`.

## Usage

1.  **Register/Login**: Create an account to track your progress.
2.  **Dashboard**: View your stats, streak, and recent activity.
3.  **Start Workout**: Choose an exercise (Squat, Pushup, etc.).
4.  **Allow Camera**: Grant camera access for pose detection.
5.  **Exercise**: Follow the instructions. The AI will count reps and give feedback.
6.  **End Session**: Click "End Session" to save your workout and update your streak.
7.  **Analytics**: Check the Analytics page for detailed charts.

## Folder Structure

- `backend/models`: Database schemas (User, Workout).
- `backend/routes`: API endpoints.
- `frontend/app`: Next.js pages (Dashboard, Auth, etc.).
- `frontend/components`: Reusable components (PoseDetector, Navbar).
- `frontend/context`: Global state (AuthContext).

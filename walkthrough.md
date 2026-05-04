# FormXpert Walkthrough

FormXpert is a full-stack AI gym assistant. This guide will help you run and verify the application.

## Prerequisites
- Node.js installed
- MongoDB installed and running (or a cloud MongoDB URI)

## Setup Steps

### 1. Backend Setup
1. Open a terminal in the `backend` directory.
2. Create a `.env` file if it doesn't exist:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/formxpert
   JWT_SECRET=secret
   ```
3. Run `npm install`.
4. Start the server: `npm run dev` (or `node server.js`).
   - You should see "MongoDB Connected" and "Server running on port 5000".

### 2. Frontend Setup
1. Open a new terminal in the `frontend` directory.
2. Run `npm install`.
3. Start the development server: `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification Checklist

### Authentication
- [ ] **Register**: Go to `/register` and create a new account. You should be redirected to the dashboard.
- [ ] **Login**: Log out and try logging in with the same credentials.

### Dashboard
- [ ] **Overview**: Check if the dashboard loads with the sidebar and stats.
- [ ] **Profile**: Navigate to Profile and verify the UI.
- [ ] **Workouts**: Browse the workout library.

### AI Workout Session
1. Navigate to **Workouts** and click "Start" on the **Squat** card (or go to `/dashboard/workout/1`).
2. **Camera Permission**: Allow camera access when prompted.
3. **Pose Detection**: Stand back until your full body is visible. You should see a skeleton overlay.
4. **Squat Test**:
   - Stand straight (Angle > 160°).
   - Perform a squat (Angle < 100°).
   - Verify that the feedback changes ("Good depth!" vs "Go lower").
   - Listen for audio feedback (ensure volume is up).

### Exercise Details Page
1. Navigate to **Workouts** from the dashboard.
2. Hover over the **Squat** or **Push Up** exercise card.
3. Click the newly added **View Details** button.
4. Verify you are routed to the specific exercise page (e.g., `/exercises/squat`).
5. Ensure the Framer Motion animations trigger properly and all sections (Hero, Key Info, Why This Exercise, Steps, Precautions, and YouTube Video) render correctly. Validate responsiveness.

## Troubleshooting
- **Camera not working**: Ensure no other app is using the camera. Check browser permissions.
- **Backend connection error**: Ensure the backend server is running on port 5000 and MongoDB is connected.

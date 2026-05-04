# FormXpert - AI-Powered Professional Gym Assistant

**FormXpert** is a state-of-the-art, full-stack web application designed to revolutionize home workouts using Computer Vision and Machine Learning. It acts as a real-time virtual trainer that not only counts repetitions but also analyzes exercise biomechanics to provide instant corrective feedback.

---

## 1. Project Vision & Core Capabilities

FormXpert is built to solve the "lone trainer" problem—where users exercising at home lack the professional oversight to prevent injury and ensure maximum efficiency.

### Key Features:
- **Precision Pose Tracking**: Leverages MediaPipe BlazePose (33 keypoints) for sub-centimeter point tracking via a standard webcam.
- **Biomechanical Analysis**: Uses custom geometric algorithms to calculate joint angles (e.g., hinge points at hips, knees, and elbows).
- **Phase-Based State Machine**: A robust movement-tracking engine that prevents "cheat" reps by requiring specific phase transitions (e.g., TOP -> DOWN -> BOTTOM -> UP).
- **Intelligent Mistake Detection**: Monitors for common form errors like "Hips Sagging" in pushups or "Insufficient Depth" in squats.
- **Dynamic Feedback Loop**: Simultaneous visual overlays (skeleton rendering) and high-quality Text-to-Speech (TTS) audio cues.
- **Performance Analytics**: Comprehensive dashboard tracking workout history, accuracy scores, and consistency streaks.
- **Comprehensive Exercise Library**: Detailed breakdowns of exercises including benefits, steps, precautions, and video demonstrations.
- **Professional Communication & Legal**: Fully functional Contact Us form powered by EmailJS, alongside themed Privacy Policy and Terms of Service pages.

---

## 2. Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **UI/UX**: Tailwind CSS 4, Framer Motion (for fluid animations)
- **Engine**: TensorFlow.js + MediaPipe Pose Detection
- **State Management**: React Context (Auth) & specialized Engine Hooks
- **Visualization**: Recharts for performance graphing
- **Communications**: EmailJS for serverless contact form handling

### **Backend**
- **Runtime**: Node.js & Express.js
- **Persistence**: MongoDB with Mongoose ODM
- **Security**: JWT-based Authentication, Bcrypt password hashing
- **Environment**: Dotenv for secure configuration

---

## 3. Technical Architecture

### **High-Level Flow**
1. **Input**: Real-time video stream (Webcam).
2. **Detection**: MediaPipe (TF.js) identifies 33 3D keypoints in the browser.
3. **Logic**: `ExerciseEngine.ts` processes points through specialized `ExerciseLogic` classes.
4. **Validation**: Movement is validated against a Finite State Machine (FSM).
5. **Action**: Feedback is generated via `AudioFeedbackEngine`; session data is persisted to the MongoDB backend.

---

## 4. Deep Dive: AI & Movement Logic

### **A. Mathematical Foundation (`angles.ts`)**
Movement is quantified using the Law of Cosines (via `atan2`) to calculate the angle between three points.
- **Formula**: `angle = |atan2(C.y-B.y, C.x-B.x) - atan2(A.y-B.y, A.x-B.x)|`
- **Vertex (B)**: The joint being measured (e.g., the Knee in a Squat).

### **B. The Exercise State Machine (`exerciseLogic.ts`)**
To ensure high accuracy, reps are not counted by simple angle thresholds. Instead, they follow a path:
- **Squat States**: `TOP` (Neutral) > `DESCENDING` (Knee < 160°) > `BOTTOM` (Knee < 90°) > `ASCENDING` (Knee > 100°) > `FINISH` (Knee > 165°).
- **Debouncing**: A 1000ms mandatory window between reps prevents double-counting.

### **C. Posture Rules (`postureRules.ts`)**
Form correction is performed by evaluating keypoint relationships:
- **Hips Sagging (Pushup)**: Checks if the Shoulder-Hip-Ankle angle deviates more than 20° from a straight line.
- **Knees Forward (Squat)**: Monitors the horizontal offset between the Knee (keypoint 25) and Toe (keypoint 31).

---

## 5. API Documentation

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Create new user account | No |
| `/api/auth/login` | `POST` | Authenticate and return JWT | No |
| `/api/workouts` | `GET` | Fetch user workout history | Yes |
| `/api/workouts` | `POST` | Log a completed exercise session | Yes |
| `/api/workouts/stats` | `GET` | Get analytics (streaks, total reps, accuracy) | Yes |

---

## 6. Directory Structure

```text
MajorProject/
├── frontend/
│   ├── app/                # Next.js Pages (dashboard, exercises, contact, privacy, terms, auth)
│   ├── components/         # PoseDetector, Sidebar, Footer, UI Elements
│   ├── lib/pose/           # CORE ENGINE
│   │   ├── exerciseLogic.ts # FSM Definitions (Squat, Pushup)
│   │   ├── postureRules.ts  # Heuristic Mistake Detection
│   │   ├── angles.ts        # Geometrical Math
│   │   └── audioService.ts  # TTS Engine
├── backend/
│   ├── models/             # Mongoose Schemas (User, Workout)
│   ├── routes/             # API Controllers
│   └── server.js           # Express Entry Point
```

---

## 7. Development & Installation

### **Prerequisites**
- Node.js (v18+)
- MongoDB (Local or Atlas)

### **Backend Setup**
1. `cd backend`
2. `npm install`
3. Configure `.env`: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`
4. `npm run dev`

### **Frontend Setup**
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Access via `localhost:3000`)

---

## 8. LLM Preparation: Expected Q&A Areas
*This section is specifically for Claude AI to help generate technical viva/interview questions.*

**Potential Discussion Topics:**
1. **Computer Vision Performance**: Why use MediaPipe in the browser instead of a Python-based OpenCV backend? (Answer: Latency, Privacy, and Cost).
2. **Algorithm Robustness**: How do you handle "camera jitter" or occlusion? (Answer: Confidence score filtering and temporal smoothing).
3. **Data Integrity**: How is the `accuracyScore` calculated? (Answer: Ratio of reps performed without triggering a `postureRule` failure).
4. **State Management**: Why use a State Machine instead of a simple `if (angle < 90)` count? (Answer: To distinguish between a completed rep, a partial rep, and unrelated movement).
5. **Future Scalability**: How would you integrate 1-on-1 live trainer sessions? (Answer: WebRTC integration).

---

**Author**: Gautam Desh 
**Project Type**: Major Final Year Project  
**License**: MIT

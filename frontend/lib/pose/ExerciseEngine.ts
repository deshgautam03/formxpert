import { Keypoint } from '@tensorflow-models/pose-detection';
import { ExerciseStateMachine, ExerciseState, ExercisePhase } from './ExerciseStateMachine';
import { MotionAnalyzer } from './MotionAnalyzer';
import { calculateAngle } from './GeometryUtils';
import { MistakeDetector } from './MistakeDetector';
import { AudioFeedbackEngine } from './AudioFeedbackEngine';
import { ExerciseDefinition } from './exercises/ExerciseDefinition';
import { Squat } from './exercises/Squat';
import { PushUp } from './exercises/PushUp';
import { ShoulderPress } from './exercises/ShoulderPress';
import { SittingPosture, SittingPostureLogic } from './exercises/SittingPosture';

export class ExerciseEngine {
    private stateMachine: ExerciseStateMachine;
    private motionAnalyzer: MotionAnalyzer;
    private mistakeDetector: MistakeDetector;
    private audioEngine: AudioFeedbackEngine;
    private sittingLogic: SittingPostureLogic;

    private currentExerciseDef: ExerciseDefinition | null = null;
    private isConfigured: boolean = false;
    private lastRepCount: number = 0;

    constructor() {
        this.stateMachine = new ExerciseStateMachine();
        this.motionAnalyzer = new MotionAnalyzer();
        this.mistakeDetector = new MistakeDetector();
        this.audioEngine = new AudioFeedbackEngine();
        this.sittingLogic = new SittingPostureLogic();
    }

    setExercise(exerciseName: string) {
        this.motionAnalyzer.reset();
        this.mistakeDetector.reset();
        this.audioEngine.reset();
        this.stateMachine.reset();
        this.sittingLogic.reset();
        this.lastRepCount = 0;

        // Select definition
        let def: ExerciseDefinition | null = null;
        if (exerciseName === 'Squat') def = Squat;
        if (exerciseName === 'Pushup') def = PushUp;
        if (exerciseName === 'Shoulder Press') def = ShoulderPress;
        if (exerciseName === 'Sitting Posture') def = SittingPosture;

        this.currentExerciseDef = def;

        if (def) {
            this.stateMachine.setConfig(def.config);
            this.isConfigured = true;
        } else {
            console.warn(`No definition found for exercise: ${exerciseName}`);
            this.isConfigured = false;
        }
    }

    update(keypoints: Keypoint[]): ExerciseState {
        if (!this.isConfigured || !this.currentExerciseDef) {
            return {
                phase: 'IDLE',
                reps: 0,
                feedback: 'Select an exercise',
                isCorrect: true
            };
        }

        // Special Case: Sitting Posture bypasses StateMachine
        if (this.currentExerciseDef.name === 'Sitting Posture') {
            const state = this.sittingLogic.update(keypoints);

            // Audio Feedback
            if (!state.isCorrect && state.feedback) {
                this.audioEngine.playFeedback([state.feedback]);
            }

            return state;
        }

        // 1. Analyze Motion
        const movementScore = this.motionAnalyzer.update(keypoints);
        const isIdle = this.motionAnalyzer.isIdle();
        const isActive = this.motionAnalyzer.isActive();

        // 2. Calculate Primary Angle
        const config = this.currentExerciseDef.config;
        let currentAngle = 0;
        const [a, b, c] = config.primaryJoints;
        const kpA = keypoints[a];
        const kpB = keypoints[b];
        const kpC = keypoints[c];

        if (kpA && kpB && kpC && (kpA.score || 0) > 0.3 && (kpB.score || 0) > 0.3 && (kpC.score || 0) > 0.3) {
            currentAngle = calculateAngle(kpA, kpB, kpC);
        } else {
            // Tracking lost
            return {
                phase: 'IDLE',
                reps: this.stateMachine.getReps(),
                feedback: "Adjust Camera",
                isCorrect: false
            };
        }

        // 3. Calculate Pose Match Score
        const poseMatchScore = this.calculatePoseMatchScore(keypoints, this.currentExerciseDef);

        // 4. Update State Machine
        const phase = this.stateMachine.update(
            currentAngle,
            poseMatchScore,
            movementScore,
            isIdle,
            isActive
        );
        const reps = this.stateMachine.getReps();

        // 5. Detect Mistakes (Only in active states)
        let mistakes: string[] = [];
        if (phase === 'MOVING_DOWN' || phase === 'BOTTOM' || phase === 'MOVING_UP') {
            mistakes = this.mistakeDetector.analyze(keypoints, phase, this.currentExerciseDef);
        } else {
            this.mistakeDetector.reset(); // Clear mistakes if not exercising
        }

        // 6. Audio Feedback
        // Reps
        if (reps > this.lastRepCount) {
            this.audioEngine.playRepCount(reps);
            this.lastRepCount = reps;
        }

        // Mistakes
        if (mistakes.length > 0) {
            this.audioEngine.playFeedback(mistakes);
        }

        // 7. Construct Feedback String
        let feedbackString: string = phase;
        if (mistakes.length > 0) {
            feedbackString = mistakes[0];
        } else if (phase === 'IDLE') {
            feedbackString = "Stand Still";
        } else if (phase === 'READY') {
            feedbackString = "Start when ready";
        } else if (phase === 'FINISH_REP') {
            feedbackString = "Good Rep!";
        }

        return {
            phase: phase,
            reps: reps,
            feedback: feedbackString,
            isCorrect: mistakes.length === 0,
            debugInfo: `Match: ${poseMatchScore.toFixed(2)} | Move: ${movementScore.toFixed(0)}`
        };
    }

    private calculatePoseMatchScore(keypoints: Keypoint[], def: ExerciseDefinition): number {
        if (!def.startPose) return 0;

        let totalScore = 0;
        let checkCount = 0;

        for (const check of def.startPose.angleChecks) {
            const [a, b, c] = check.joints;
            const kpA = keypoints[a];
            const kpB = keypoints[b];
            const kpC = keypoints[c];

            if (kpA && kpB && kpC && (kpA.score || 0) > 0.3 && (kpB.score || 0) > 0.3 && (kpC.score || 0) > 0.3) {
                const angle = calculateAngle(kpA, kpB, kpC);
                const diff = Math.abs(angle - check.target);

                // Score: 1 if within tolerance, drops to 0 as diff increases
                // Linear drop off?
                // If diff <= tolerance, score = 1.
                // If diff > tolerance, score decreases.
                // Let's say if diff is double tolerance, score is 0.

                let score = 0;
                if (diff <= check.tolerance) {
                    score = 1;
                } else {
                    const maxDiff = check.tolerance * 2;
                    if (diff < maxDiff) {
                        score = 1 - ((diff - check.tolerance) / check.tolerance);
                    }
                }

                totalScore += score;
                checkCount++;
            }
        }

        return checkCount > 0 ? totalScore / checkCount : 0;
    }
}

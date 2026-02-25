import { Keypoint } from '@tensorflow-models/pose-detection';
import { calculateAngle } from './angles';

export type ExerciseType = 'Squat' | 'Pushup' | 'Shoulder Press';

export interface ExerciseState {
    currentPhase: string;
    reps: number;
    feedback: string;
    isCorrect: boolean;
}

export abstract class ExerciseLogic {
    protected state: string = 'START';
    protected reps: number = 0;
    protected feedback: string = "";
    protected isCorrect: boolean = true;
    protected lastRepTime: number = 0;

    abstract update(keypoints: Keypoint[]): ExerciseState;

    reset() {
        this.state = 'START';
        this.reps = 0;
        this.feedback = "Get ready";
        this.isCorrect = true;
    }
}

export class SquatLogic extends ExerciseLogic {
    // States: TOP -> DESCENDING -> BOTTOM -> ASCENDING -> TOP

    update(keypoints: Keypoint[]): ExerciseState {
        const hip = keypoints[23]; // left_hip (BlazePose 23)
        const knee = keypoints[25]; // left_knee (BlazePose 25)
        const ankle = keypoints[27]; // left_ankle (BlazePose 27)

        if (!hip || !knee || !ankle || (hip.score || 0) < 0.3 || (knee.score || 0) < 0.3) {
            return { currentPhase: this.state, reps: this.reps, feedback: "Adjust camera", isCorrect: false };
        }

        const kneeAngle = calculateAngle(hip, knee, ankle);

        // State Machine
        switch (this.state) {
            case 'START':
            case 'TOP':
                if (kneeAngle > 165) {
                    this.feedback = "Start squat";
                    this.isCorrect = true;
                }
                if (kneeAngle < 160) {
                    this.state = 'DESCENDING';
                }
                break;
            case 'DESCENDING':
                if (kneeAngle < 100) { // Approaching bottom
                    this.state = 'BOTTOM';
                } else if (kneeAngle > 170) {
                    // Aborted rep
                    this.state = 'TOP';
                }
                this.feedback = "Go lower";
                break;
            case 'BOTTOM':
                if (kneeAngle < 90) {
                    this.feedback = "Good depth!";
                    this.isCorrect = true;
                    // Wait for ascent
                    if (kneeAngle > 100) {
                        this.state = 'ASCENDING';
                    }
                } else {
                    // If they didn't quite hit 90 but are close, we might still count it in ASCENDING if strictness allows
                    // But per requirements: Bottom < 90
                    if (kneeAngle > 100) {
                        this.state = 'ASCENDING';
                    }
                }
                break;
            case 'ASCENDING':
                if (kneeAngle > 165) {
                    // Rep complete
                    if (Date.now() - this.lastRepTime > 1000) { // 1 sec debounce
                        this.reps++;
                        this.lastRepTime = Date.now();
                        this.state = 'TOP';
                        this.feedback = "Good rep!";
                    }
                }
                break;
        }

        return {
            currentPhase: this.state,
            reps: this.reps,
            feedback: this.feedback,
            isCorrect: this.isCorrect
        };
    }
}

export class PushupLogic extends ExerciseLogic {
    // States: TOP -> DOWN -> BOTTOM -> UP -> TOP

    update(keypoints: Keypoint[]): ExerciseState {
        const shoulder = keypoints[11]; // left_shoulder
        const elbow = keypoints[13];    // left_elbow
        const wrist = keypoints[15];    // left_wrist

        if (!shoulder || !elbow || !wrist || (shoulder.score || 0) < 0.3) {
            return { currentPhase: this.state, reps: this.reps, feedback: "Adjust camera", isCorrect: false };
        }

        const elbowAngle = calculateAngle(shoulder, elbow, wrist);

        switch (this.state) {
            case 'START':
            case 'TOP':
                if (elbowAngle > 160) {
                    this.feedback = "Start pushup";
                    this.isCorrect = true;
                }
                if (elbowAngle < 150) {
                    this.state = 'DOWN';
                }
                break;
            case 'DOWN':
                if (elbowAngle < 100) {
                    this.state = 'BOTTOM';
                } else if (elbowAngle > 165) {
                    this.state = 'TOP'; // Aborted
                }
                this.feedback = "Lower chest";
                break;
            case 'BOTTOM':
                if (elbowAngle < 90) {
                    this.feedback = "Push up!";
                    this.isCorrect = true;
                    if (elbowAngle > 100) {
                        this.state = 'UP';
                    }
                } else {
                    if (elbowAngle > 100) {
                        this.state = 'UP';
                    }
                }
                break;
            case 'UP':
                if (elbowAngle > 160) {
                    if (Date.now() - this.lastRepTime > 1000) {
                        this.reps++;
                        this.lastRepTime = Date.now();
                        this.state = 'TOP';
                        this.feedback = "Good rep!";
                    }
                }
                break;
        }

        return {
            currentPhase: this.state,
            reps: this.reps,
            feedback: this.feedback,
            isCorrect: this.isCorrect
        };
    }
}

export class ShoulderPressLogic extends ExerciseLogic {
    // States: LOW -> GOING_UP -> HIGH -> GOING_DOWN -> LOW

    update(keypoints: Keypoint[]): ExerciseState {
        const shoulder = keypoints[12]; // right_shoulder (using right side for press usually, or both)
        const elbow = keypoints[14];    // right_elbow
        const wrist = keypoints[16];    // right_wrist

        if (!shoulder || !elbow || !wrist || (shoulder.score || 0) < 0.3) {
            return { currentPhase: this.state, reps: this.reps, feedback: "Adjust camera", isCorrect: false };
        }

        const elbowAngle = calculateAngle(shoulder, elbow, wrist);

        switch (this.state) {
            case 'START':
            case 'LOW':
                if (elbowAngle < 100) {
                    this.feedback = "Press up";
                    this.isCorrect = true;
                }
                if (elbowAngle > 110) {
                    this.state = 'GOING_UP';
                }
                break;
            case 'GOING_UP':
                if (elbowAngle > 150) {
                    this.state = 'HIGH';
                } else if (elbowAngle < 80) {
                    this.state = 'LOW'; // Aborted
                }
                this.feedback = "Extend arms";
                break;
            case 'HIGH':
                if (elbowAngle > 165) {
                    this.feedback = "Lower down";
                    this.isCorrect = true;
                    if (elbowAngle < 150) {
                        this.state = 'GOING_DOWN';
                    }
                } else {
                    if (elbowAngle < 150) {
                        this.state = 'GOING_DOWN';
                    }
                }
                break;
            case 'GOING_DOWN':
                if (elbowAngle < 100) {
                    if (Date.now() - this.lastRepTime > 1000) {
                        this.reps++;
                        this.lastRepTime = Date.now();
                        this.state = 'LOW';
                        this.feedback = "Good rep!";
                    }
                }
                break;
        }

        return {
            currentPhase: this.state,
            reps: this.reps,
            feedback: this.feedback,
            isCorrect: this.isCorrect
        };
    }
}

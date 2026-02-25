import { Keypoint } from '@tensorflow-models/pose-detection';

export type ExercisePhase = 'IDLE' | 'READY' | 'MOVING_DOWN' | 'BOTTOM' | 'MOVING_UP' | 'FINISH_REP' | 'MONITORING';

export interface ExerciseState {
    phase: ExercisePhase;
    reps: number;
    feedback: string;
    isCorrect: boolean;
    debugInfo?: string;
}

export interface ExerciseConfig {
    startAngle: number;
    descendThreshold: number;
    bottomThreshold: number;
    upThreshold: number;
    primaryJoints: [number, number, number];
}

export class ExerciseStateMachine {
    private state: ExercisePhase = 'IDLE';
    private reps: number = 0;

    // Time tracking
    private stateEnterTime: number = 0;
    private lastTransitionTime: number = 0;

    // Condition tracking
    private conditionStartTime: number = 0;
    private lastConditionState: string = ''; // 'IDLE_TO_READY', etc.

    // Rep Cycle Flags
    private hasReachedBottom: boolean = false;
    private repStartTime: number = 0;

    // Config
    private config: ExerciseConfig | null = null;

    constructor() {
        this.stateEnterTime = Date.now();
    }

    setConfig(config: ExerciseConfig) {
        this.config = config;
        this.reset();
    }

    reset() {
        this.state = 'IDLE';
        this.reps = 0;
        this.stateEnterTime = Date.now();
        this.hasReachedBottom = false;
        this.repStartTime = 0;
    }

    getState(): ExercisePhase {
        return this.state;
    }

    getReps(): number {
        return this.reps;
    }

    /**
     * Updates the state machine.
     * @param currentAngle Primary joint angle
     * @param poseMatchScore 0-1 score of similarity to start pose
     * @param movementScore Pixel movement score
     * @param isIdle Is movement below IDLE threshold
     * @param isActive Is movement above ACTIVE threshold
     */
    update(
        currentAngle: number,
        poseMatchScore: number,
        movementScore: number,
        isIdle: boolean,
        isActive: boolean
    ): ExercisePhase {
        const now = Date.now();
        const timeInState = now - this.stateEnterTime;

        // --- TRANSITION LOGIC ---

        switch (this.state) {
            case 'IDLE':
                // Transition IDLE -> READY
                // Condition: poseMatchScore >= 0.8 AND isIdle (movement < IDLE_THRESHOLD)
                // Duration: 0.5s
                if (poseMatchScore >= 0.8 && isIdle) {
                    if (this.checkCondition('IDLE_TO_READY', 500)) {
                        this.transitionTo('READY');
                    }
                } else {
                    this.resetCondition();
                }
                break;

            case 'READY':
                // Reset rep flags when entering/staying in READY
                this.hasReachedBottom = false;
                this.repStartTime = 0;

                // Transition READY -> MOVING_DOWN
                // Condition: isActive (movement > ACTIVE_THRESHOLD) AND Angle moving in correct direction
                // Duration: 100ms (to avoid noise)
                const isMovingDown = this.checkPhase1Start(currentAngle);

                if (isActive && isMovingDown) {
                    if (this.checkCondition('READY_TO_MOVING', 100)) {
                        this.transitionTo('MOVING_DOWN');
                        this.repStartTime = Date.now();
                    }
                }
                // Transition READY -> IDLE
                // Condition: poseMatchScore < 0.6 (loose tolerance) OR bad tracking
                // Duration: 500ms
                else if (poseMatchScore < 0.6) {
                    if (this.checkCondition('READY_TO_IDLE', 500)) {
                        this.transitionTo('IDLE');
                    }
                } else {
                    this.resetCondition();
                }
                break;

            case 'MOVING_DOWN':
                // MOVING_DOWN -> BOTTOM
                if (this.checkBottomReached(currentAngle)) {
                    // Instant transition allowed for bottom hit? Or require hold?
                    // Usually instant is fine if threshold is strict.
                    // Let's require 2 frames (approx 60ms) or just instant.
                    // User said "multiple frames". Let's use 100ms.
                    if (this.checkCondition('MOVING_TO_BOTTOM', 100)) {
                        this.transitionTo('BOTTOM');
                        this.hasReachedBottom = true;
                    }
                }
                // Abort -> READY
                else if (this.checkReturnToStart(currentAngle)) {
                    this.transitionTo('READY');
                }
                // Abort -> IDLE (stopped moving for too long?)
                else if (isIdle && timeInState > 2000) {
                    this.transitionTo('IDLE');
                }
                else {
                    // Reset condition if not meeting bottom criteria
                }
                break;

            case 'BOTTOM':
                this.hasReachedBottom = true;

                // BOTTOM -> MOVING_UP
                if (this.checkAscentStarted(currentAngle)) {
                    if (this.checkCondition('BOTTOM_TO_UP', 100)) {
                        this.transitionTo('MOVING_UP');
                    }
                }
                break;

            case 'MOVING_UP':
                // MOVING_UP -> FINISH_REP (-> READY)
                // Condition: Return to start pose (angle) AND poseMatchScore is good?
                // User said: "Pose at the end resembles READY (poseMatchScore >= 0.8 again)"
                if (this.checkReturnToStart(currentAngle) && poseMatchScore >= 0.8) {
                    // Check full cycle requirements
                    const repDuration = (Date.now() - this.repStartTime) / 1000;
                    if (this.hasReachedBottom && repDuration >= 0.7) {
                        this.transitionTo('FINISH_REP');
                    } else {
                        // Invalid rep (too fast or didn't hit bottom)
                        this.transitionTo('READY'); // No count
                    }
                }
                // Back to BOTTOM?
                else if (this.checkBottomReached(currentAngle)) {
                    this.transitionTo('BOTTOM');
                }
                break;

            case 'FINISH_REP':
                // Instant transition to READY after counting
                this.reps++;
                this.transitionTo('READY');
                break;
        }

        return this.state;
    }

    private checkCondition(key: string, durationMs: number): boolean {
        const now = Date.now();
        if (this.lastConditionState !== key) {
            this.lastConditionState = key;
            this.conditionStartTime = now;
            return false;
        }
        return (now - this.conditionStartTime) >= durationMs;
    }

    private resetCondition() {
        this.lastConditionState = '';
        this.conditionStartTime = 0;
    }

    private transitionTo(newState: ExercisePhase) {
        if (this.state !== newState) {
            console.log(`[State Machine] ${this.state} -> ${newState}`);
            this.state = newState;
            this.stateEnterTime = Date.now();
            this.resetCondition();
        }
    }

    // --- ANGLE CHECKS ---

    private checkPhase1Start(angle: number): boolean {
        if (!this.config) return false;
        const isStandard = this.config.startAngle > this.config.bottomThreshold;
        if (isStandard) {
            return angle < this.config.descendThreshold;
        } else {
            return angle > this.config.descendThreshold;
        }
    }

    private checkBottomReached(angle: number): boolean {
        if (!this.config) return false;
        const isStandard = this.config.startAngle > this.config.bottomThreshold;
        if (isStandard) {
            return angle < this.config.bottomThreshold;
        } else {
            return angle > this.config.bottomThreshold;
        }
    }

    private checkAscentStarted(angle: number): boolean {
        if (!this.config) return false;
        const isStandard = this.config.startAngle > this.config.bottomThreshold;
        if (isStandard) {
            return angle > this.config.upThreshold;
        } else {
            return angle < this.config.upThreshold;
        }
    }

    private checkReturnToStart(angle: number): boolean {
        if (!this.config) return false;
        const isStandard = this.config.startAngle > this.config.bottomThreshold;
        if (isStandard) {
            return angle > (this.config.startAngle - 10);
        } else {
            return angle < (this.config.startAngle + 10);
        }
    }
}

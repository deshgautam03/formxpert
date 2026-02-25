import { Keypoint } from '@tensorflow-models/pose-detection';
import { ExerciseDefinition } from './ExerciseDefinition';
import { calculateVerticalAngle, calculateDistance } from '../GeometryUtils';
import { ExerciseState } from '../ExerciseStateMachine';

// BlazePose Keypoints
// 11: left_shoulder
// 12: right_shoulder
// 23: left_hip
// 24: right_hip
// 7: left_ear
// 8: right_ear

export const SittingPosture: ExerciseDefinition = {
    name: 'Sitting Posture',
    config: {
        startAngle: 180,
        descendThreshold: 0,
        bottomThreshold: 0,
        upThreshold: 0,
        primaryJoints: [11, 23, 11] // Dummy joints to satisfy type, we handle logic manually
    },
    startPose: {
        angleChecks: []
    },
    mistakeRules: []
};

export class SittingPostureLogic {
    private goodFrames: number = 0;
    private badFrames: number = 0;
    private lastUpdateTime: number = 0;
    private totalGoodTime: number = 0; // in seconds
    private badStartTime: number = 0;

    reset() {
        this.goodFrames = 0;
        this.badFrames = 0;
        this.lastUpdateTime = 0;
        this.totalGoodTime = 0;
        this.badStartTime = 0;
    }

    update(keypoints: Keypoint[]): ExerciseState {
        const l_shldr = keypoints[11];
        const r_shldr = keypoints[12];
        const l_ear = keypoints[7];
        const l_hip = keypoints[23];

        if (!l_shldr || !r_shldr || !l_ear || !l_hip ||
            (l_shldr.score || 0) < 0.3 || (l_hip.score || 0) < 0.3) {
            return {
                phase: 'IDLE',
                reps: Math.floor(this.totalGoodTime),
                feedback: 'Adjust Camera - Show Side View',
                isCorrect: false
            };
        }

        // 1. Check Alignment (Shoulders overlapping in side view)
        // User logic: dist(l_shldr, r_shldr) < 100
        // We need to normalize 100px threshold? 
        // User code used raw pixels (w=640?). 
        // We'll trust strict alignment check or just skip it if user is casual.
        // Let's implement it but be generous.
        const shoulderDist = calculateDistance(l_shldr, r_shldr);

        // 2. Calculate Angles
        // Neck: Shoulder -> Ear (Vertical alignment)
        const neckInclination = calculateVerticalAngle(l_shldr, l_ear);

        // Torso: Hip -> Shoulder
        const torsoInclination = calculateVerticalAngle(l_hip, l_shldr);

        let feedback = "";
        let isCorrect = true;

        if (neckInclination < 40 && torsoInclination < 10) {
            this.badFrames = 0;
            this.badStartTime = 0;

            // Accumulate Good Time
            const now = Date.now();
            if (this.lastUpdateTime > 0) {
                const dt = (now - this.lastUpdateTime) / 1000;
                this.totalGoodTime += dt;
            }
            this.lastUpdateTime = now;

            feedback = "Good Posture";
            isCorrect = true;
        } else {
            // Bad Posture
            this.lastUpdateTime = Date.now(); // Keep updating time but don't add to good time

            if (this.badStartTime === 0) {
                this.badStartTime = Date.now();
            }

            const badDuration = (Date.now() - this.badStartTime) / 1000;

            isCorrect = false;

            if (badDuration > 2) {
                // Warning
                feedback = torsoInclination >= 10 ? "Sit Up Straight!" : "Fix Neck Position!";
            } else {
                feedback = "Adjusting...";
            }
        }

        return {
            phase: 'MONITORING',
            reps: Math.floor(this.totalGoodTime), // Use Reps as Seconds Counter
            feedback: feedback,
            isCorrect: isCorrect,
            debugInfo: `Neck: ${neckInclination.toFixed(0)}° Torso: ${torsoInclination.toFixed(0)}°`
        };
    }
}

import { ExerciseDefinition } from './ExerciseDefinition';
import { calculateAngle } from '../GeometryUtils';

export const PushUp: ExerciseDefinition = {
    name: 'Pushup',
    config: {
        startAngle: 160, // Elbow > 160
        descendThreshold: 150, // Elbow < 150 (start going down)
        bottomThreshold: 90, // Elbow < 90
        upThreshold: 120, // Elbow > 120
        primaryJoints: [11, 13, 15] // Shoulder, Elbow, Wrist
    },
    startPose: {
        angleChecks: [
            { joints: [11, 13, 15], target: 170, tolerance: 20 }, // Elbows extended
            { joints: [11, 23, 27], target: 180, tolerance: 20 }  // Body straight (Shoulder-Hip-Ankle)
        ]
    },
    mistakeRules: [
        {
            code: 'HIPS_SAGGING',
            message: 'Lift your hips',
            check: (keypoints, state) => {
                // Mistake: hips below shoulder-ankle line
                // Or "Hips sagging: hips below shoulder–ankle line"
                // We can check the angle Shoulder-Hip-Ankle.
                // If it's < 160 (hyperextension/sagging).
                if (state === 'IDLE' || state === 'READY') return false;

                const shoulder = keypoints[11];
                const hip = keypoints[23];
                const ankle = keypoints[27];

                if (!shoulder || !hip || !ankle) return false;

                const bodyAngle = calculateAngle(shoulder, hip, ankle);
                // 180 is straight. < 160 means hips are "in" (sagging towards floor if prone).
                // Wait, if prone:
                // Shoulder (high), Ankle (high), Hip (low) -> Angle < 180.
                // If piking (hips high) -> Angle < 180 too?
                // We need to know direction.
                // Usually "Sagging" means Hip Y > Shoulder Y and Hip Y > Ankle Y (if Y increases downwards).
                // Let's check if Hip Y is significantly below the line connecting Shoulder and Ankle.

                // Line equation from Shoulder to Ankle.
                // Check Hip distance to line.
                // Or just use angle.
                // If angle < 160, it's either sagging or piking.
                // Sagging: Hips are lower (larger Y).
                // Piking: Hips are higher (smaller Y).

                // Let's check Y coords.
                // Midpoint of Shoulder-Ankle Y.
                const midY = (shoulder.y + ankle.y) / 2;
                if (hip.y > midY + 20) { // Hip is lower than line (sagging)
                    return bodyAngle < 160;
                }
                return false;
            }
        },
        {
            code: 'NOT_DEEP_ENOUGH',
            message: 'Go lower',
            check: (keypoints, state) => {
                // Elbow never < 100
                // Similar to Squat, hard to detect stateless.
                return false;
            }
        },
        {
            code: 'UNEVEN_ARMS',
            message: 'Push evenly',
            check: (keypoints, state) => {
                // Left vs Right elbow difference > threshold
                // Compare elbow angles?
                const leftShoulder = keypoints[11];
                const leftElbow = keypoints[13];
                const leftWrist = keypoints[15];

                const rightShoulder = keypoints[12];
                const rightElbow = keypoints[14];
                const rightWrist = keypoints[16];

                if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) return false;

                const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
                const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

                return Math.abs(leftAngle - rightAngle) > 20;
            }
        }
    ]
};

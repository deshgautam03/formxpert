import { ExerciseDefinition } from './ExerciseDefinition';
import { calculateAngle } from '../GeometryUtils';

export const ShoulderPress: ExerciseDefinition = {
    name: 'Shoulder Press',
    config: {
        // Inverted logic handled by Engine/SM
        startAngle: 90, // Elbow ~90
        descendThreshold: 110, // "Moving Up" (Phase 1) starts when > 110
        bottomThreshold: 150, // "Top" (Phase 2) reached when > 150
        upThreshold: 140, // "Moving Down" (Phase 3) starts when < 140
        primaryJoints: [12, 14, 16] // Right Shoulder, Elbow, Wrist (or Left)
    },
    startPose: {
        angleChecks: [
            { joints: [12, 14, 16], target: 90, tolerance: 25 }, // Elbows bent at start
            { joints: [11, 13, 15], target: 90, tolerance: 25 }  // Check both arms if possible
        ]
    },
    mistakeRules: [
        {
            code: 'INCOMPLETE_EXTENSION',
            message: 'Extend fully',
            check: (keypoints, state) => {
                // Elbow < 165 at top
                // If state is BOTTOM (which maps to TOP for press), check angle.
                if (state === 'BOTTOM') { // "Top" of press
                    const shoulder = keypoints[12];
                    const elbow = keypoints[14];
                    const wrist = keypoints[16];
                    if (!shoulder || !elbow || !wrist) return false;

                    const angle = calculateAngle(shoulder, elbow, wrist);
                    return angle < 165;
                }
                return false;
            }
        },
        {
            code: 'UNEVEN_SHOULDERS',
            message: 'Keep shoulders level',
            check: (keypoints, state) => {
                const leftShoulder = keypoints[11];
                const rightShoulder = keypoints[12];
                if (!leftShoulder || !rightShoulder) return false;

                const yDiff = Math.abs(leftShoulder.y - rightShoulder.y);
                const width = Math.abs(leftShoulder.x - rightShoulder.x);

                return yDiff > width * 0.15; // Threshold
            }
        },
        {
            code: 'FORWARD_PRESSING',
            message: 'Press straight up',
            check: (keypoints, state) => {
                // Wrist x too far from shoulder x
                const shoulder = keypoints[12];
                const wrist = keypoints[16];
                if (!shoulder || !wrist) return false;

                const xDiff = Math.abs(shoulder.x - wrist.x);
                return xDiff > 50; // Pixel threshold, tune this
            }
        }
    ]
};

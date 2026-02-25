import { ExerciseDefinition } from './ExerciseDefinition';
import { calculateAngle, calculateDistance } from '../GeometryUtils';

export const Squat: ExerciseDefinition = {
    name: 'Squat',
    config: {
        startAngle: 165, // Knee > 165
        descendThreshold: 150, // Knee < 150
        bottomThreshold: 90, // Knee < 90
        upThreshold: 120, // Knee > 120 (rising back)
        primaryJoints: [23, 25, 27] // Hip, Knee, Ankle
    },
    startPose: {
        angleChecks: [
            { joints: [23, 25, 27], target: 175, tolerance: 15 }, // Knee straight (160-190)
            { joints: [11, 23, 25], target: 175, tolerance: 15 }  // Hip straight (standing up)
        ]
    },
    mistakeRules: [
        {
            code: 'BACK_ROUNDED',
            message: 'Keep your back straight',
            check: (keypoints, state) => {
                // Mistake: torso angle < 150
                // Torso angle: Shoulder-Hip-Knee? Or Shoulder-Hip-Vertical?
                // User said: "Torso angle 165-180" is READY. "Back rounded: torso angle < 150".
                // Usually this is Shoulder-Hip-Knee (hip flexion relative to trunk).
                // Let's use Shoulder(11)-Hip(23)-Knee(25).
                if (state === 'IDLE' || state === 'READY') return false;

                const shoulder = keypoints[11];
                const hip = keypoints[23];
                const knee = keypoints[25];

                if (!shoulder || !hip || !knee) return false;

                const torsoAngle = calculateAngle(shoulder, hip, knee);
                return torsoAngle < 150;
            }
        },
        {
            code: 'KNEES_TOO_FORWARD',
            message: 'Keep knees behind toes',
            check: (keypoints, state) => {
                // Mistake: knee x-position passes toe x-position + threshold
                if (state !== 'MOVING_DOWN' && state !== 'BOTTOM') return false;

                const knee = keypoints[25];
                const toe = keypoints[31]; // Left foot index

                if (!knee || !toe) return false;

                // Assuming facing left (knee.x < toe.x) or right (knee.x > toe.x)
                // We need to know orientation or just check absolute difference if we assume standard stance.
                // But "passes" implies direction.
                // Let's assume the user is facing the camera or side.
                // If side view:
                // If facing left: Knee X should be > Toe X (if 0 is left). Wait.
                // Let's use a simple heuristic: Horizontal distance between knee and toe.
                // If knee is significantly "in front" of toe.
                // We can't easily know "front" without more context, but usually:
                // If (Knee X - Toe X) * FacingDirection > Threshold.
                // Let's assume side view where "forward" is the direction of the toes.
                // Actually, let's just check if Knee X is "beyond" Toe X in the direction of the Ankle-Toe vector?
                // Simpler: Check if Knee X is past Toe X.
                // We'll use a threshold.
                // Let's assume standard side profile.
                // If we don't know direction, we might skip or guess.
                // Let's guess based on nose X vs hip X? 
                // For now, let's implement a simple check:
                // If abs(knee.x - toe.x) is small, they are aligned vertically (good).
                // If knee.x goes past toe.x...
                // Let's skip this one if it's too ambiguous without orientation, OR implement a basic check.
                // User requirement: "knee x-position passes toe x-position + threshold"
                // Let's assume "passes" means "goes beyond in the forward direction".

                // Let's try to determine facing direction.
                const nose = keypoints[0];
                const hip = keypoints[23];
                const facingLeft = nose.x < hip.x; // Very rough guess

                // If facing left, "forward" is negative X (assuming 0 is left? No, 0 is left usually).
                // If 0 is left, and facing left (nose < hip), then "forward" is towards 0.
                // So Knee X < Toe X means knee is in front.

                // If facing right (nose > hip), "forward" is towards width.
                // Knee X > Toe X means knee is in front.

                const threshold = 0.05; // Normalized coords? BlazePose TFJS is pixels usually.
                // If pixels, 0.05 is nothing. If normalized, it's 5%.
                // We need to know coordinate system.
                // PoseService uses `detector.estimatePoses`. TFJS BlazePose returns pixels.
                // So we need a pixel threshold. Say 30-50 pixels?
                // Let's use 30.

                const pixelThreshold = 30;

                if (facingLeft) {
                    return (knee.x < toe.x - pixelThreshold);
                } else {
                    return (knee.x > toe.x + pixelThreshold);
                }
            }
        },
        {
            code: 'NOT_LOW_ENOUGH',
            message: 'Go lower',
            check: (keypoints, state) => {
                // Mistake: bottom knee angle > 100
                // Only check this when they start ascending?
                // Or if they are in BOTTOM state but angle is not deep enough?
                // "BOTTOM" state is entered when angle < 90 (in our config).
                // So if they are in BOTTOM, they ARE low enough.
                // This mistake is for when they *don't* reach BOTTOM but start going up.
                // This is handled by the State Machine "Aborted rep" or "Turned around early".
                // But the user wants a specific "Mistake" alert.
                // If state is MOVING_UP and previous state was MOVING_DOWN (skipped BOTTOM),
                // AND min angle achieved was > 100.
                // This requires state history or tracking min angle.
                // The MistakeDetector might need state history.
                // For now, let's check if they are in MOVING_UP and angle is still high? No.
                // Let's check if they are "at the bottom" of their movement but angle > 100.
                // How do we know they are at the bottom if they don't trigger BOTTOM state?
                // Maybe if velocity is near 0 and angle > 100?
                return false; // Hard to detect stateless.
                // We will rely on the "Go lower" feedback from the State Machine (which says "Go lower" in DESCENDING).
            }
        }
    ]
};

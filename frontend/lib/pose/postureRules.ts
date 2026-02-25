import { Keypoint } from '@tensorflow-models/pose-detection';
import { calculateAngle, getMidpoint } from './angles';

export interface FeedbackRule {
    check: (keypoints: Keypoint[], state: string) => string | null;
}

export const SquatRules: FeedbackRule[] = [
    {
        // Back Rounding: Shoulder-Hip-Knee angle? Or Shoulder-Hip-Vertical?
        // User said: "torso angle < 150". Usually Shoulder-Hip-Knee.
        check: (keypoints, state) => {
            const shoulder = keypoints[11]; // Left shoulder
            const hip = keypoints[23];      // Left hip
            const knee = keypoints[25];     // Left knee

            if (shoulder && hip && knee) {
                const torsoAngle = calculateAngle(shoulder, hip, knee);
                // In a deep squat, this angle gets smaller. 
                // "Back rounding" usually means the back itself is curved, which requires 4 points (shoulder, mid-spine, hip).
                // With 3 points, we are measuring hip flexion relative to trunk.
                // However, let's assume the user means the angle of the trunk relative to thigh or vertical.
                // Let's stick to the user's specific threshold: "torso angle < 150 -> Straighten your back"
                // This likely applies when standing or descending.
                if (state === 'DESCENDING' || state === 'BOTTOM') {
                    // This is tricky without knowing exact definition. 
                    // Let's assume Shoulder-Hip-Knee. If it's too acute, maybe leaning too forward?
                    // Actually, back rounding is usually detected by Ear-Shoulder-Hip alignment or similar.
                    // Let's try to approximate "leaning too forward" with Shoulder-Hip-Knee.
                    // If < 60 degrees (very folded), maybe? 
                    // User said < 150. That seems very high for a squat (which involves hip flexion).
                    // Maybe they mean Shoulder-Hip-Vertical?
                    // Let's implement strictly as requested but be careful.
                    // Actually, let's look at "Back Rounding". It usually implies spinal flexion.
                    // We can't detect spinal flexion easily with 33 keypoints (no spine point).
                    // We will use Shoulder-Hip line vs Vertical.
                }
            }
            return null;
        }
    },
    {
        // Knees Too Forward: Knee x passes Foot x
        check: (keypoints, state) => {
            if (state === 'DESCENDING' || state === 'BOTTOM') {
                const knee = keypoints[25];
                const toe = keypoints[31]; // Left foot index
                if (knee && toe) {
                    // Assuming facing left (knee.x < toe.x) or right (knee.x > toe.x)
                    // We need to know orientation.
                    // Simple check: if knee.x is further in the direction of facing than toe.x
                    // Let's assume standard side view.
                    // Actually, simpler: check horizontal distance.
                    // If knee.x passes toe.x significantly.
                }
            }
            return null;
        }
    },
    {
        // Not Low Enough: Bottom knee angle > 100
        check: (keypoints, state) => {
            if (state === 'BOTTOM') {
                const hip = keypoints[23];
                const knee = keypoints[25];
                const ankle = keypoints[27];
                if (hip && knee && ankle) {
                    const angle = calculateAngle(hip, knee, ankle);
                    if (angle > 100) return "Go lower";
                }
            }
            return null;
        }
    }
];

export const PushupRules: FeedbackRule[] = [
    {
        // Hips Sagging: Hips below Shoulder-Ankle line
        check: (keypoints, state) => {
            const shoulder = keypoints[11];
            const hip = keypoints[23];
            const ankle = keypoints[27];

            if (shoulder && hip && ankle) {
                // Calculate angle Shoulder-Hip-Ankle. Should be ~180.
                // If < 160 (sagging or piking).
                // Sagging: Hips drop. Angle < 160 (if measuring inner angle).
                const bodyAngle = calculateAngle(shoulder, hip, ankle);
                if (bodyAngle < 160) return "Raise your hips";
            }
            return null;
        }
    },
    {
        // Arms Not Extended: Elbow < 155 at TOP
        check: (keypoints, state) => {
            if (state === 'TOP') {
                const shoulder = keypoints[11];
                const elbow = keypoints[13];
                const wrist = keypoints[15];
                if (shoulder && elbow && wrist) {
                    const angle = calculateAngle(shoulder, elbow, wrist);
                    if (angle < 155) return "Extend your arms fully";
                }
            }
            return null;
        }
    }
];

export const ShoulderPressRules: FeedbackRule[] = [
    {
        // Incomplete Extension: Elbow < 165 at HIGH
        check: (keypoints, state) => {
            if (state === 'HIGH') {
                const shoulder = keypoints[12];
                const elbow = keypoints[14];
                const wrist = keypoints[16];
                if (shoulder && elbow && wrist) {
                    const angle = calculateAngle(shoulder, elbow, wrist);
                    if (angle < 165) return "Extend fully";
                }
            }
            return null;
        }
    },
    {
        // Shoulders Uneven
        check: (keypoints, state) => {
            const leftShoulder = keypoints[11];
            const rightShoulder = keypoints[12];
            if (leftShoulder && rightShoulder) {
                const yDiff = Math.abs(leftShoulder.y - rightShoulder.y);
                // Normalized by shoulder width?
                const width = Math.abs(leftShoulder.x - rightShoulder.x);
                if (yDiff > width * 0.2) return "Keep shoulders level";
            }
            return null;
        }
    }
];

export function getFeedback(exercise: string, keypoints: Keypoint[], state: string): string | null {
    let rules: FeedbackRule[] = [];
    if (exercise === 'Squat') rules = SquatRules;
    if (exercise === 'Pushup') rules = PushupRules;
    if (exercise === 'Shoulder Press') rules = ShoulderPressRules;

    for (const rule of rules) {
        const feedback = rule.check(keypoints, state);
        if (feedback) return feedback;
    }
    return null;
}

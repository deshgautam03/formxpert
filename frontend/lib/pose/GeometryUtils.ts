import { Keypoint } from '@tensorflow-models/pose-detection';

/**
 * Calculates the angle (in degrees) between three points (A, B, C).
 * B is the vertex.
 */
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
    if (!a || !b || !c) return 0;

    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
        angle = 360.0 - angle;
    }

    return angle;
}

/**
 * Calculates the Euclidean distance between two points.
 */
export function calculateDistance(a: Keypoint, b: Keypoint): number {
    if (!a || !b) return 0;
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * Returns the midpoint between two keypoints.
 */
export function getMidpoint(a: Keypoint, b: Keypoint): { x: number; y: number } {
    if (!a || !b) return { x: 0, y: 0 };
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

/**
 * Checks if a set of critical keypoints are visible based on a score threshold.
 */
export function areKeypointsVisible(keypoints: Keypoint[], indices: number[], threshold = 0.3): boolean {
    return indices.every(index => {
        const kp = keypoints[index];
        return kp && (kp.score || 0) >= threshold;
    });
}

/**
 * Calculates the angle of the segment P1->P2 with respect to Vertical UP (0 degrees).
 * Returns 0 if P2 is directly above P1.
 */
export function calculateVerticalAngle(p1: Keypoint, p2: Keypoint): number {
    if (!p1 || !p2) return 0;
    const dist = calculateDistance(p1, p2);
    if (dist === 0) return 0;

    // y increases downwards in canvas/video
    // We want 0 degrees when P2 is directly ABOVE P1 (y2 < y1)
    // Vector P1->P2: (x2-x1, y2-y1)
    // We compare with Up Vector (0, -1)

    // Using the user's logic derivation:
    // ratio = (y1 - y2) / dist
    // If P2 is above P1, y2 < y1 => y1 - y2 is positive. ratio > 0. acos -> [0, 90]
    // If P2 is below P1, y2 > y1 => y1 - y2 is negative. ratio < 0. acos -> [90, 180]

    const dy = p1.y - p2.y;
    const ratio = Math.max(-1, Math.min(1, dy / dist));
    const radians = Math.acos(ratio);
    return (radians * 180) / Math.PI;
}

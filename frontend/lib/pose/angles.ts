import { Keypoint } from '@tensorflow-models/pose-detection';

/**
 * Calculates the angle between three points (A, B, C) where B is the vertex.
 * Returns the angle in degrees (0-180).
 */
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
        angle = 360.0 - angle;
    }

    return angle;
}

/**
 * Calculates the midpoint between two keypoints.
 */
export function getMidpoint(a: Keypoint, b: Keypoint): { x: number, y: number } {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    };
}

/**
 * Calculates the distance between two keypoints.
 */
export function getDistance(a: Keypoint, b: Keypoint): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

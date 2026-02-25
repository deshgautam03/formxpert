import { Keypoint } from '@tensorflow-models/pose-detection';
import { calculateDistance } from './GeometryUtils';

export class MotionAnalyzer {
    private prevKeypoints: Keypoint[] | null = null;
    private movementScore: number = 0;

    // Thresholds (in pixels, assuming 640x480 video)
    // IDLE: Very still. ACTIVE: Clearly moving.
    // Tune these based on observation.
    // If sum of deltas for 8 joints.
    // 1 pixel movement per joint = 8 score.
    // Breathing/noise might be 5-10.
    // Active movement usually > 20-30.
    public readonly IDLE_THRESHOLD = 10;
    public readonly ACTIVE_THRESHOLD = 25;

    /**
     * Updates the motion score based on the latest keypoints.
     * Returns the current movement score.
     */
    update(currentKeypoints: Keypoint[]): number {
        if (!this.prevKeypoints) {
            this.prevKeypoints = currentKeypoints;
            this.movementScore = 0;
            return 0;
        }

        // Calculate total movement of key joints
        const relevantIndices = [11, 12, 13, 14, 23, 24, 25, 26]; // Shoulders, Elbows, Hips, Knees
        let totalDistance = 0;
        let validPoints = 0;

        for (const idx of relevantIndices) {
            const curr = currentKeypoints[idx];
            const prev = this.prevKeypoints[idx];

            if (curr && prev && (curr.score || 0) > 0.3 && (prev.score || 0) > 0.3) {
                totalDistance += calculateDistance(curr, prev);
                validPoints++;
            }
        }

        // If we have enough valid points, scale up if some are missing?
        // Or just use raw sum. Raw sum is safer if we track same joints.
        this.movementScore = totalDistance;

        this.prevKeypoints = currentKeypoints;

        return this.movementScore;
    }

    getScore(): number {
        return this.movementScore;
    }

    isIdle(): boolean {
        return this.movementScore < this.IDLE_THRESHOLD;
    }

    isActive(): boolean {
        return this.movementScore > this.ACTIVE_THRESHOLD;
    }

    reset() {
        this.prevKeypoints = null;
        this.movementScore = 0;
    }
}

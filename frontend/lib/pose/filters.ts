import { Keypoint } from '@tensorflow-models/pose-detection';

/**
 * Simple Low Pass Filter for smoothing keypoints.
 */
export class LowPassFilter {
    private alpha: number;
    private prevValue: number | null = null;

    constructor(alpha: number = 0.5) {
        this.alpha = alpha;
    }

    filter(value: number): number {
        if (this.prevValue === null) {
            this.prevValue = value;
            return value;
        }
        const newValue = this.prevValue + this.alpha * (value - this.prevValue);
        this.prevValue = newValue;
        return newValue;
    }

    reset() {
        this.prevValue = null;
    }
}

/**
 * Manages smoothing for all 33 pose keypoints.
 */
export class PoseSmoother {
    private filters: { x: LowPassFilter; y: LowPassFilter; z?: LowPassFilter }[];

    constructor(alpha: number = 0.5) {
        // Initialize filters for 33 keypoints
        this.filters = Array(33).fill(null).map(() => ({
            x: new LowPassFilter(alpha),
            y: new LowPassFilter(alpha),
            z: new LowPassFilter(alpha)
        }));
    }

    smoothKeypoints(keypoints: Keypoint[]): Keypoint[] {
        return keypoints.map((kp, index) => {
            if (!this.filters[index]) return kp;

            const smoothedX = this.filters[index].x.filter(kp.x);
            const smoothedY = this.filters[index].y.filter(kp.y);

            // Handle optional Z coordinate
            let smoothedZ = undefined;
            if (kp.z !== undefined && this.filters[index].z) {
                smoothedZ = this.filters[index].z.filter(kp.z);
            }

            return {
                ...kp,
                x: smoothedX,
                y: smoothedY,
                z: smoothedZ
            };
        });
    }

    reset() {
        this.filters.forEach(f => {
            f.x.reset();
            f.y.reset();
            if (f.z) f.z.reset();
        });
    }
}

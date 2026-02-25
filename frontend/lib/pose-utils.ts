export interface Point {
    x: number;
    y: number;
    z?: number;
    visibility?: number;
}

export function calculateAngle(a: Point, b: Point, c: Point): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);

    if (angle > 180.0) {
        angle = 360 - angle;
    }

    return angle;
}

export function drawSkeleton(ctx: CanvasRenderingContext2D, keypoints: Point[]) {
    // Define connections for a standard skeleton
    const connections = [
        [11, 13], [13, 15], // Left arm
        [12, 14], [14, 16], // Right arm
        [11, 12], // Shoulders
        [11, 23], [12, 24], // Torso
        [23, 24], // Hips
        [23, 25], [25, 27], // Left leg
        [24, 26], [26, 28]  // Right leg
    ];

    // Draw lines
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    connections.forEach(([i, j]) => {
        const p1 = keypoints[i];
        const p2 = keypoints[j];
        if (p1 && p2 && (p1.visibility || 1) > 0.5 && (p2.visibility || 1) > 0.5) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    });

    // Draw points
    ctx.fillStyle = '#ccff00';
    keypoints.forEach((point) => {
        if ((point.visibility || 1) > 0.5) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

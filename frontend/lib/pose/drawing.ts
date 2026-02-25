import { Keypoint, Pose } from '@tensorflow-models/pose-detection';

export function drawPosesOnCanvas(canvas: HTMLCanvasElement, poses: Pose[]) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!poses.length) return;

    const pose = poses[0];
    const keypoints = pose.keypoints;

    // Draw keypoints
    keypoints.forEach((kp: Keypoint) => {
        if (kp.score && kp.score < 0.3) return;
        const { x, y } = kp;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
    });

    // Draw skeleton lines using BlazePose connectivity
    const edges: [number, number][] = [
        [11, 13], [13, 15], // left arm
        [12, 14], [14, 16], // right arm
        [11, 12],           // shoulders
        [11, 23], [12, 24], // torso
        [23, 25], [25, 27], // left leg
        [24, 26], [26, 28], // right leg
        [15, 17], [15, 19], [15, 21], // left hand
        [16, 18], [16, 20], [16, 22], // right hand
        [27, 29], [27, 31], // left foot
        [28, 30], [28, 32]  // right foot
    ];

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00ffff';

    edges.forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];
        if (!kp1 || !kp2) return;
        if (kp1.score && kp1.score < 0.3) return;
        if (kp2.score && kp2.score < 0.3) return;

        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
    });
}

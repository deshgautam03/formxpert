import { Keypoint } from '@tensorflow-models/pose-detection';
import { ExerciseConfig, ExercisePhase } from '../ExerciseStateMachine';

export interface MistakeRule {
    code: string;
    message: string;
    check: (keypoints: Keypoint[], state: ExercisePhase, geometry: any) => boolean;
}

export interface StartPoseConfig {
    // List of angles to check for "Ideal Start Pose"
    // Each item: [jointA, jointB, jointC, targetAngle, tolerance]
    // e.g. [11, 23, 25, 180, 15] -> Torso upright
    angleChecks: {
        joints: [number, number, number];
        target: number;
        tolerance: number;
    }[];
}

export interface ExerciseDefinition {
    name: string;
    config: ExerciseConfig;
    startPose: StartPoseConfig;
    mistakeRules: MistakeRule[];
}

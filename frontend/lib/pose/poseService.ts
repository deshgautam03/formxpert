import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import { ExerciseEngine } from './ExerciseEngine';
import { ExerciseState } from './ExerciseStateMachine';

export class PoseService {
    private static instance: PoseService;
    private detector: poseDetection.PoseDetector | null = null;
    private initialized = false;
    private engine: ExerciseEngine;

    private constructor() {
        this.engine = new ExerciseEngine();
    }

    static getInstance() {
        if (!PoseService.instance) {
            PoseService.instance = new PoseService();
        }
        return PoseService.instance;
    }

    async initialize() {
        if (this.initialized) return;
        if (typeof window === 'undefined') return;

        console.log("Initializing BlazePose with TFJS runtime...");
        await tf.setBackend('webgl');
        await tf.ready();

        const model = poseDetection.SupportedModels.BlazePose;

        const detectorConfig: poseDetection.BlazePoseTfjsModelConfig = {
            runtime: 'tfjs',
            enableSmoothing: true,
            modelType: 'full',
        };

        this.detector = await poseDetection.createDetector(model, detectorConfig);
        this.initialized = true;
        console.log("BlazePose TFJS initialized!");
    }

    async estimatePose(video: HTMLVideoElement) {
        if (!this.detector) return null;

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            return null;
        }

        const poses = await this.detector.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true,
        });

        if (poses.length > 0) {
            return poses[0];
        }
        return null;
    }

    // New methods for Engine integration
    setExercise(exerciseName: string) {
        this.engine.setExercise(exerciseName);
    }

    processFrame(keypoints: poseDetection.Keypoint[]): ExerciseState {
        return this.engine.update(keypoints);
    }

    reset() {
        // Reset engine if needed, or just setExercise again
    }
}

export const poseService = PoseService.getInstance();

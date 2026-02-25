import { Keypoint } from '@tensorflow-models/pose-detection';
import { ExerciseDefinition, MistakeRule } from './exercises/ExerciseDefinition';
import { ExercisePhase } from './ExerciseStateMachine';

interface MistakeState {
    count: number;
    lastDetected: number;
}

export class MistakeDetector {
    private mistakeStates: Map<string, MistakeState> = new Map();
    private readonly FRAME_THRESHOLD = 5; // "That mistake persists for 5 consecutive frames"

    reset() {
        this.mistakeStates.clear();
    }

    analyze(
        keypoints: Keypoint[],
        phase: ExercisePhase,
        exerciseDef: ExerciseDefinition
    ): string[] {
        if (phase === 'IDLE' || phase === 'READY') {
            // "Detect mistakes only when state ≠ IDLE and state ≠ READY"
            // (Except maybe start pose mistakes? But user said "Detect mistakes only when state ≠ IDLE and state ≠ READY")
            // Let's stick to the rule.
            this.mistakeStates.clear();
            return [];
        }

        const activeMistakes: string[] = [];

        for (const rule of exerciseDef.mistakeRules) {
            const isMistake = rule.check(keypoints, phase, {}); // Pass geometry if needed

            let state = this.mistakeStates.get(rule.code);
            if (!state) {
                state = { count: 0, lastDetected: 0 };
                this.mistakeStates.set(rule.code, state);
            }

            if (isMistake) {
                state.count++;
            } else {
                state.count = 0;
            }

            if (state.count >= this.FRAME_THRESHOLD) {
                activeMistakes.push(rule.message);
            }
        }

        return activeMistakes;
    }
}

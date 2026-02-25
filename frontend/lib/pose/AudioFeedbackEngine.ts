import { ExercisePhase } from './ExerciseStateMachine';

export class AudioFeedbackEngine {
    private lastSpokenTime: Map<string, number> = new Map();
    private readonly COOLDOWN_MS = 4000; // "3-6 seconds". Let's use 4s.

    // Placeholder for actual TTS or audio playback
    // In a real app, this would call window.speechSynthesis or play audio files.
    private speakFn: (text: string) => void;

    constructor(speakFn?: (text: string) => void) {
        this.speakFn = speakFn || this.defaultSpeak;
    }

    private defaultSpeak(text: string) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // Cancel current speech to avoid queue buildup? 
            // Or just queue? User said "No spam".
            // If we speak, we should probably cancel previous if it's just feedback.
            // But for Rep counts, we want them heard.
            // Let's just speak.
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2; // Slightly faster
            window.speechSynthesis.speak(utterance);
            console.log(`Audio: "${text}"`);
        } else {
            console.log(`[Audio Simulation]: "${text}"`);
        }
    }

    update(phase: ExercisePhase, mistakes: string[], reps: number) {
        // 1. Rep Counting
        // "Rep audio ('one', 'two', etc.) must play once per FINISH_REP"
        // This is handled by the transition to FINISH_REP.
        // But update is called every frame. We need to know if we JUST entered FINISH_REP.
        // The Engine calls update. 
        // We can track lastRep count.
    }

    // Better API: explicit trigger methods

    playRepCount(reps: number) {
        this.speakFn(reps.toString());
    }

    playFeedback(mistakes: string[]) {
        const now = Date.now();

        // Prioritize mistakes? Or just play first available?
        // "Audio for a mistake plays only if... cooldown of 3-6 seconds has passed for THAT mistake type"

        for (const mistake of mistakes) {
            const lastTime = this.lastSpokenTime.get(mistake) || 0;
            if (now - lastTime > this.COOLDOWN_MS) {
                this.speakFn(mistake);
                this.lastSpokenTime.set(mistake, now);
                // Play only one mistake per frame to avoid overlap?
                // User said "No spam".
                // If we play one, we should stop for this frame.
                return;
            }
        }
    }

    reset() {
        this.lastSpokenTime.clear();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}

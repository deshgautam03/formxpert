export class AudioService {
    private lastSpokenTime: number = 0;
    private lastMessage: string = "";
    private cooldown: number = 3000; // 3 seconds default

    speak(text: string, force: boolean = false) {
        const now = Date.now();

        // Don't repeat the same message too often
        if (!force && text === this.lastMessage && now - this.lastSpokenTime < this.cooldown) {
            return;
        }

        // Allow different messages to interrupt? Or queue?
        // For fitness, immediate feedback is better, but not overlapping.
        if (window.speechSynthesis.speaking) {
            if (force) {
                window.speechSynthesis.cancel(); // Priority message (like rep count)
            } else {
                return; // Wait for current to finish
            }
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
        this.lastSpokenTime = now;
        this.lastMessage = text;
    }
}

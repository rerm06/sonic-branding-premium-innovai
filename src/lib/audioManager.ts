class AudioManager {
    private currentAudio: HTMLAudioElement | null = null;
    private listeners: Set<(audio: HTMLAudioElement | null) => void> = new Set();

    register(audio: HTMLAudioElement) {
        audio.addEventListener('play', () => {
            if (this.currentAudio && this.currentAudio !== audio) {
                this.currentAudio.pause();
            }
            this.currentAudio = audio;
            this.notify();
        });
        audio.addEventListener('pause', () => {
            if (this.currentAudio === audio) {
                this.notify();
            }
        });
    }

    play(audio: HTMLAudioElement, url?: string) {
        if (url && audio.src !== url) {
            audio.src = url;
        }
        audio.play().catch(e => console.error("AudioManager play error", e));
    }

    pause(audio: HTMLAudioElement) {
        audio.pause();
    }

    stopAll() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
            this.notify();
        }
    }

    getCurrentAudio() {
        return this.currentAudio;
    }

    subscribe(callback: (audio: HTMLAudioElement | null) => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    private notify() {
        this.listeners.forEach(cb => cb(this.currentAudio));
    }
}

export const audioManager = new AudioManager();

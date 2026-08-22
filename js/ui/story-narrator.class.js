'use strict';

class StoryNarrator {
    constructor(textElementId) {
        this.textElementId = textElementId;
        this.currentUtterance = null;
    }

    read() {
        if (!this.canRead()) {
            return false;
        }

        this.stop();
        this.currentUtterance = this.createUtterance();
        speechSynthesis.speak(this.currentUtterance);
        return true;
    }

    stop() {
        if (this.isSupported()) {
            speechSynthesis.cancel();
        }

        this.currentUtterance = null;
    }

    canRead() {
        return this.isSupported() && this.getStoryText().length > 0;
    }

    isSupported() {
        return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }

    createUtterance() {
        const utterance = new SpeechSynthesisUtterance(this.getStoryText());
        utterance.lang = 'de-DE';
        utterance.rate = 0.94;
        utterance.pitch = 1;
        utterance.volume = 1;
        return utterance;
    }

    getStoryText() {
        const storyElement = document.getElementById(this.textElementId);

        if (!storyElement) {
            return '';
        }

        return storyElement.innerText.trim();
    }
}
'use strict';

/** Reads the configured story text through the browser speech API. */
class StoryNarrator {
    /** @param {string} textElementId - Story text element identifier. */
    constructor(textElementId) {
        this.textElementId = textElementId;
        this.currentUtterance = null;
    }

    /** @returns {boolean} Whether story narration was started. */
    read() {
        if (!this.canRead()) {
            return false;
        }

        this.stop();
        this.currentUtterance = this.createUtterance();
        speechSynthesis.speak(this.currentUtterance);
        return true;
    }

    /** Stops active narration and clears its utterance reference. */
    stop() {
        if (this.isSupported()) {
            speechSynthesis.cancel();
        }

        this.currentUtterance = null;
    }

    /** @returns {boolean} Whether supported, non-empty story text is available. */
    canRead() {
        return this.isSupported() && this.getStoryText().length > 0;
    }

    /** @returns {boolean} Whether the required browser speech APIs exist. */
    isSupported() {
        return 'speechSynthesis' in window &&
            'SpeechSynthesisUtterance' in window;
    }

    /** @returns {SpeechSynthesisUtterance} Configured German utterance. */
    createUtterance() {
        const utterance = new SpeechSynthesisUtterance(this.getStoryText());
        utterance.lang = 'de-DE';
        utterance.rate = 0.94;
        utterance.pitch = 1;
        utterance.volume = 1;
        return utterance;
    }

    /** @returns {string} Trimmed visible story text or an empty string. */
    getStoryText() {
        const storyElement = document.getElementById(this.textElementId);
        if (!storyElement) {
            return '';
        }

        return storyElement.innerText.trim();
    }
}
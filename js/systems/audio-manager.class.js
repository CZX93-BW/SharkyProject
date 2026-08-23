'use strict';

/** Controls background music, sound effects, and their volume settings. */
class AudioManager {
    /** Creates all audio elements with their initial playback settings. */
    constructor() {
        this.musicEnabled = false;
        this.soundEnabled = true;
        this.isUnlocked = false;
        this.musicVolume = GAME_CONFIG.musicVolume;
        this.soundVolume = GAME_CONFIG.soundVolume;
        this.backgroundMusic = this.createBackgroundMusic();
        this.sounds = this.createSounds();
    }

    /** @returns {HTMLAudioElement|null} Looping background music element. */
    createBackgroundMusic() {
        return this.createAudio(ASSET_CONFIG.audio.music.mainTheme, true);
    }

    /** @returns {Object} Registered game sound effects. */
    createSounds() {
        return {
            coin: this.createAudio(ASSET_CONFIG.audio.sounds.coin),
            poisonBottle: this.createAudio(
                ASSET_CONFIG.audio.sounds.poisonBottle
            ),
            damage: this.createAudio(ASSET_CONFIG.audio.sounds.damage),
            finSlap: this.createAudio(ASSET_CONFIG.audio.sounds.finSlap),
            poisonShot: this.createAudio(ASSET_CONFIG.audio.sounds.poisonShot),
            bubbleTrap: this.createAudio(ASSET_CONFIG.audio.sounds.bubbleTrap),
            shop: this.createAudio(ASSET_CONFIG.audio.sounds.shop),
            win: this.createAudio(ASSET_CONFIG.audio.sounds.win),
            gameOver: this.createAudio(ASSET_CONFIG.audio.sounds.gameOver)
        };
    }

    /**
     * @param {string} audioPath - Audio asset path.
     * @param {boolean} [isLooping=false] - Whether playback should loop.
     * @returns {HTMLAudioElement|null} Configured audio element or null.
     */
    createAudio(audioPath, isLooping = false) {
        if (!audioPath) {
            return null;
        }
        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        audio.loop = isLooping;
        return audio;
    }

    /** Unlocks browser audio after the first user interaction. */
    unlock() {
        this.isUnlocked = true;
        if (this.musicEnabled) {
            this.playMusic();
        }
    }

    /** Toggles background music playback. */
    toggleMusic() {
        this.setMusicEnabled(!this.musicEnabled);
    }

    /** @param {boolean} isEnabled - Whether background music is enabled. */
    setMusicEnabled(isEnabled) {
        this.musicEnabled = isEnabled;
        this.updateMusicState();
    }

    /** Synchronizes playback with the current music setting. */
    updateMusicState() {
        if (this.musicEnabled) {
            this.playMusic();
            return;
        }
        this.stopMusic();
    }

    /** Starts background music when browser audio is available. */
    playMusic() {
        if (!this.canPlayMusic()) {
            return;
        }
        this.backgroundMusic.volume = this.musicVolume;
        this.backgroundMusic.play().catch(() => {});
    }

    /** Pauses the current background music element. */
    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    /** Toggles game sound effects. */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }

    /** @param {string} soundName - Registered sound effect name. */
    playSound(soundName) {
        if (!this.canPlaySound(soundName)) {
            return;
        }
        this.playAudioCopy(this.sounds[soundName]);
    }

    /** @param {HTMLAudioElement} audio - Source sound effect element. */
    playAudioCopy(audio) {
        const audioCopy = audio.cloneNode();
        audioCopy.volume = this.soundVolume;
        audioCopy.play().catch(() => {});
    }

    /** @param {number} percent - Music volume percentage. */
    setMusicVolumeByPercent(percent) {
        this.musicVolume = this.getNormalizedVolume(percent);
        this.updateBackgroundMusicVolume();
    }

    /** @param {number} percent - Sound volume percentage. */
    setSoundVolumeByPercent(percent) {
        this.soundVolume = this.getNormalizedVolume(percent);
    }

    /** Applies the current volume to the background music element. */
    updateBackgroundMusicVolume() {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }

    /**
     * @param {number} percent - Volume percentage to normalize.
     * @returns {number} Clamped volume value between zero and one.
     */
    getNormalizedVolume(percent) {
        const safePercent = Math.min(100, Math.max(0, percent));
        return safePercent / 100;
    }

    /** @returns {number} Current background music volume percentage. */
    getMusicVolumePercent() {
        return Math.round(this.musicVolume * 100);
    }

    /** @returns {number} Current sound effect volume percentage. */
    getSoundVolumePercent() {
        return Math.round(this.soundVolume * 100);
    }

    /** @returns {HTMLAudioElement|false|null} Music or falsy state. */
    canPlayMusic() {
        return this.isUnlocked && this.backgroundMusic;
    }

    /**
     * @param {string} soundName - Registered sound effect name.
     * @returns {HTMLAudioElement|false|null} Sound or falsy state.
     */
    canPlaySound(soundName) {
        return this.isUnlocked &&
            this.soundEnabled &&
            this.sounds[soundName];
    }

    /** @returns {boolean} Whether background music is enabled. */
    isMusicEnabled() {
        return this.musicEnabled;
    }

    /** @returns {boolean} Whether sound effects are enabled. */
    isSoundEnabled() {
        return this.soundEnabled;
    }
}
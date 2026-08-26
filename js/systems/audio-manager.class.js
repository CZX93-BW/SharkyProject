'use strict';

/** @type {string} Local-storage key for persistent audio preferences. */
const AUDIO_SETTINGS_KEY = 'sharkyAudioSettings';

/** Controls music tracks, sound effects, muting, and persistent volume values. */
class AudioManager {
    /** Creates all audio elements and restores the saved user preferences. */
    constructor() {
        const settings = this.loadSettings();
        this.initializeSettings(settings);
        this.isUnlocked = false;
        this.currentMusicName = 'gameplay';
        this.musicTracks = this.createMusicTracks();
        this.sounds = this.createSounds();
        this.soundPools = this.createSoundPools();
        this.activeSounds = new Set();
    }

    /** @param {Object} settings - Stored audio preference values. */
    initializeSettings(settings) {
        this.musicEnabled = settings.musicEnabled ?? true;
        this.soundEnabled = settings.soundEnabled ?? true;
        this.muted = settings.muted ?? false;
        this.musicVolume = this.getStoredVolume(
            settings.musicVolume, GAME_CONFIG.musicVolume
        );
        this.soundVolume = this.getStoredVolume(
            settings.soundVolume, GAME_CONFIG.soundVolume
        );
    }

    /** @returns {Object} Stored settings or an empty fallback object. */
    loadSettings() {
        try {
            const value = localStorage.getItem(AUDIO_SETTINGS_KEY);
            return value ? JSON.parse(value) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * @param {*} value - Stored value to validate.
     * @param {number} fallback - Default volume.
     * @returns {number} Safe volume.
     */
    getStoredVolume(value, fallback) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.min(1, Math.max(0, value));
    }

    /** Persists enabled states, mute state, and both volume values. */
    saveSettings() {
        try {
            const settings = JSON.stringify(this.createStoredSettings());
            localStorage.setItem(AUDIO_SETTINGS_KEY, settings);
        } catch (error) {
            return;
        }
    }

    /** @returns {Object} Serializable audio preference state. */
    createStoredSettings() {
        return {
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            muted: this.muted,
            musicVolume: this.musicVolume,
            soundVolume: this.soundVolume
        };
    }

    /** @returns {Object} Looping music tracks. */
    createMusicTracks() {
        return {
            gameplay: this.createAudio(
                ASSET_CONFIG.audio.music.gameplay,
                true
            ),
            boss: this.createAudio(
                ASSET_CONFIG.audio.music.boss,
                true
            )
        };
    }

    /** @returns {Object} Registered sound effects. */
    createSounds() {
        return Object.fromEntries(
            Object.entries(ASSET_CONFIG.audio.sounds).map(([name, path]) => {
                return [name, this.createAudio(path)];
            })
        );
    }

    /** @returns {Object} Prepared sound-effect pools. */
    createSoundPools() {
        return Object.fromEntries(
            Object.entries(this.sounds).map(([name, audio]) => {
                return [name, this.createSoundPool(audio)];
            })
        );
    }

    /** @param {HTMLAudioElement|null} audio - Effect source.
     * @returns {HTMLAudioElement[]} Prepared copies. */
    createSoundPool(audio) {
        if (!audio) {
            return [];
        }
        return Array.from({ length: 4 }, () => this.cloneAudio(audio));
    }

    /** @param {HTMLAudioElement} audio - Element to clone.
     * @returns {HTMLAudioElement} Prepared clone. */
    cloneAudio(audio) {
        const audioCopy = audio.cloneNode();
        audioCopy.preload = 'auto';
        audioCopy.load?.();
        return audioCopy;
    }

    /** @param {string} audioPath - Audio asset path.
     * @param {boolean} [isLooping=false] - Whether playback should loop.
     * @returns {HTMLAudioElement|null} Configured element or null. */
    createAudio(audioPath, isLooping = false) {
        if (!audioPath) {
            return null;
        }
        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        audio.loop = isLooping;
        audio.load?.();
        return audio;
    }

    /** @param {boolean} [shouldStartMusic=true] - Whether music starts now. */
    unlock(shouldStartMusic = true) {
        this.isUnlocked = true;
        if (shouldStartMusic) {
            this.updateMusicState();
        }
    }

    /** Toggles background music and saves the new setting. */
    toggleMusic() {
        this.setMusicEnabled(!this.musicEnabled);
    }

    /** @param {boolean} isEnabled - Whether background music is enabled. */
    setMusicEnabled(isEnabled) {
        this.musicEnabled = Boolean(isEnabled);
        if (this.musicEnabled) {
            this.muted = false;
        }
        this.updateMusicState();
        this.saveSettings();
    }

    /** Toggles sound effects and saves the new setting. */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.muted = false;
        }
        if (!this.soundEnabled) {
            this.stopSoundEffects();
        }
        this.saveSettings();
    }

    /** Toggles the global mute state. */
    toggleMute() {
        this.toggleAllAudio();
    }

    /** @param {boolean} isMuted - Whether every audio source is muted. */
    setMuted(isMuted) {
        this.setAllAudioEnabled(!Boolean(isMuted));
    }

    /** Toggles music and sound effects together. */
    toggleAllAudio() {
        this.setAllAudioEnabled(!this.isAllAudioEnabled());
    }

    /** @param {boolean} isEnabled - Whether all audio should be enabled. */
    setAllAudioEnabled(isEnabled) {
        this.musicEnabled = Boolean(isEnabled);
        this.soundEnabled = Boolean(isEnabled);
        this.muted = !isEnabled;
        if (!isEnabled) {
            this.stopAllPlayback();
        } else {
            this.updateMusicState();
        }
        this.saveSettings();
    }

    /** Selects and starts the regular gameplay music. */
    playGameplayMusic() {
        this.setMusicTrack('gameplay');
    }

    /** Selects and starts the boss encounter music. */
    playBossMusic() {
        this.setMusicTrack('boss');
    }

    /** @param {string} trackName - Registered music track name. */
    setMusicTrack(trackName) {
        if (!this.musicTracks[trackName]) {
            return;
        }
        if (trackName !== this.currentMusicName) {
            this.stopCurrentMusic();
            this.currentMusicName = trackName;
        }
        this.updateMusicState();
    }

    /** Synchronizes playback with music and mute settings. */
    updateMusicState() {
        if (this.musicEnabled && !this.muted) {
            this.playMusic();
            return;
        }
        this.pauseMusic();
    }

    /** Starts the selected music track when browser audio is available. */
    playMusic() {
        const music = this.getCurrentMusic();
        if (!this.canPlayMusic(music)) {
            return;
        }
        music.volume = this.musicVolume;
        music.play().catch(() => {});
    }

    /** Pauses the selected music track without resetting its position. */
    pauseMusic() {
        const music = this.getCurrentMusic();
        if (music) {
            music.pause();
        }
    }

    /** Stops and rewinds the selected music track. */
    stopCurrentMusic() {
        const music = this.getCurrentMusic();
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
    }

    /** Stops and rewinds every registered music track. */
    stopMusic() {
        Object.values(this.musicTracks).forEach((music) => {
            if (music) {
                music.pause();
                music.currentTime = 0;
            }
        });
    }

    /** @returns {HTMLAudioElement|null} Currently selected music element. */
    getCurrentMusic() {
        return this.musicTracks[this.currentMusicName] || null;
    }

    /** @param {HTMLAudioElement|null} music - Track to validate.
     * @returns {boolean} Whether it may play. */
    canPlayMusic(music) {
        return Boolean(this.isUnlocked && this.musicEnabled &&
            !this.muted && music);
    }

    /** @param {string} soundName - Registered effect name. */
    playSound(soundName) {
        if (!this.canPlaySound(soundName)) {
            return;
        }
        this.playPreparedAudio(this.getAvailableSound(soundName));
    }

    /** @param {string} soundName - Registered effect name.
     * @returns {HTMLAudioElement} Available pool element. */
    getAvailableSound(soundName) {
        const pool = this.soundPools[soundName];
        return pool.find((audio) => {
            return audio.paused || audio.ended;
        }) || pool[0];
    }

    /** @param {HTMLAudioElement} audio - Prepared effect element. */
    playPreparedAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = this.soundVolume;
        this.activeSounds.add(audio);
        audio.onended = () => this.activeSounds.delete(audio);
        audio.play().catch(() => this.activeSounds.delete(audio));
    }

    /** Stops and removes all currently playing effect copies. */
    stopSoundEffects() {
        this.activeSounds.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeSounds.clear();
    }

    /** Stops all music and sound-effect playback immediately. */
    stopAllPlayback() {
        this.stopMusic();
        this.stopSoundEffects();
    }

    /** @param {string} enemyType - Enemy type causing contact damage. */
    playEnemyContactSound(enemyType) {
        const isJellyfish =
            String(enemyType).startsWith('jellyFish');
        this.playSound(
            isJellyfish ? 'jellyfishShock' : 'enemyBite'
        );
    }

    /** @param {number} percent - Music volume from zero to one hundred. */
    setMusicVolumeByPercent(percent) {
        this.musicVolume = this.getNormalizedVolume(percent);
        this.updateMusicVolume();
        this.saveSettings();
    }

    /** @param {number} percent - Effect volume from zero to one hundred. */
    setSoundVolumeByPercent(percent) {
        this.soundVolume = this.getNormalizedVolume(percent);
        this.saveSettings();
    }

    /** Applies the current volume to every music track. */
    updateMusicVolume() {
        Object.values(this.musicTracks).forEach((music) => {
            if (music) {
                music.volume = this.musicVolume;
            }
        });
    }

    /** @param {number} percent - Percentage to normalize.
     * @returns {number} Value from zero to one. */
    getNormalizedVolume(percent) {
        const safePercent = Math.min(
            100,
            Math.max(0, Number(percent) || 0)
        );
        return safePercent / 100;
    }

    /** @returns {number} Current music volume percentage. */
    getMusicVolumePercent() {
        return Math.round(this.musicVolume * 100);
    }

    /** @returns {number} Current effect volume percentage. */
    getSoundVolumePercent() {
        return Math.round(this.soundVolume * 100);
    }

    /** @param {string} soundName - Effect name.
     * @returns {boolean} Whether it may play. */
    canPlaySound(soundName) {
        return Boolean(this.isUnlocked && this.soundEnabled &&
            !this.muted && this.soundPools[soundName]?.length);
    }

    /** @returns {boolean} Whether background music is enabled. */
    isMusicEnabled() {
        return this.musicEnabled;
    }

    /** @returns {boolean} Whether sound effects are enabled. */
    isSoundEnabled() {
        return this.soundEnabled;
    }

    /** @returns {boolean} Whether music and effects are both enabled. */
    isAllAudioEnabled() {
        return this.musicEnabled &&
            this.soundEnabled &&
            !this.muted;
    }

    /** @returns {boolean} Whether all audio is currently muted. */
    isMuted() {
        return this.muted;
    }
}
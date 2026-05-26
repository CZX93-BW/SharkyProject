'use strict';

class AudioManager {
    constructor() {
        this.musicEnabled = false;
        this.soundEnabled = true;
        this.isUnlocked = false;
        this.backgroundMusic = this.createBackgroundMusic();
        this.sounds = this.createSounds();
    }

    createBackgroundMusic() {
        return this.createAudio(ASSET_CONFIG.audio.music.mainTheme, true);
    }

    createSounds() {
        return {
            coin: this.createAudio(ASSET_CONFIG.audio.sounds.coin),
            poisonBottle: this.createAudio(ASSET_CONFIG.audio.sounds.poisonBottle),
            damage: this.createAudio(ASSET_CONFIG.audio.sounds.damage),
            finSlap: this.createAudio(ASSET_CONFIG.audio.sounds.finSlap),
            poisonShot: this.createAudio(ASSET_CONFIG.audio.sounds.poisonShot),
            bubbleTrap: this.createAudio(ASSET_CONFIG.audio.sounds.bubbleTrap),
            shop: this.createAudio(ASSET_CONFIG.audio.sounds.shop),
            win: this.createAudio(ASSET_CONFIG.audio.sounds.win),
            gameOver: this.createAudio(ASSET_CONFIG.audio.sounds.gameOver)
        };
    }

    createAudio(audioPath, isLooping = false) {
        if (!audioPath) {
            return null;
        }

        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        audio.loop = isLooping;
        return audio;
    }

    unlock() {
        this.isUnlocked = true;

        if (this.musicEnabled) {
            this.playMusic();
        }
    }

    toggleMusic() {
        this.setMusicEnabled(!this.musicEnabled);
    }

    setMusicEnabled(isEnabled) {
        this.musicEnabled = isEnabled;
        this.updateMusicState();
    }

    updateMusicState() {
        if (this.musicEnabled) {
            this.playMusic();
            return;
        }

        this.stopMusic();
    }

    playMusic() {
        if (!this.canPlayMusic()) {
            return;
        }

        this.backgroundMusic.volume = GAME_CONFIG.musicVolume;
        this.backgroundMusic.play().catch(() => {});
    }

    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }

    playSound(soundName) {
        if (!this.canPlaySound(soundName)) {
            return;
        }

        this.playAudioCopy(this.sounds[soundName]);
    }

    playAudioCopy(audio) {
        const audioCopy = audio.cloneNode();
        audioCopy.volume = GAME_CONFIG.soundVolume;
        audioCopy.play().catch(() => {});
    }

    canPlayMusic() {
        return this.isUnlocked && this.backgroundMusic;
    }

    canPlaySound(soundName) {
        return this.isUnlocked &&
            this.soundEnabled &&
            this.sounds[soundName];
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }
}
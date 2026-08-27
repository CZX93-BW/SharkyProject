'use strict';

/** Manages audio buttons, volume inputs, and their synchronized state. */
class UiAudioControls {
    /** @param {AudioManager} audioManager - Game audio controller. */
    constructor(audioManager) {
        this.audioManager = audioManager;
    }

    /** Registers every audio-related interface listener. */
    bindControls() {
        this.bindCompactAudioButton();
        this.bindAudioToggleButtons();
        this.bindAudioVolumeControls();
    }

    /** Registers pointer and keyboard activation for the compact button. */
    bindCompactAudioButton() {
        const button = document.getElementById('musicToggleButton');
        if (!button) {
            return;
        }
        this.bindCompactPointerEvent(button);
        this.bindCompactClickEvent(button);
    }

    /** @param {HTMLButtonElement} button - Compact audio button. */
    bindCompactPointerEvent(button) {
        button.addEventListener('pointerdown', (event) => {
            this.handleCompactAudioPointer(event);
        });
    }

    /** @param {HTMLButtonElement} button - Compact audio button. */
    bindCompactClickEvent(button) {
        button.addEventListener('click', (event) => {
            this.handleCompactAudioKeyboardClick(event);
        });
    }

    /** @param {PointerEvent} event - Pointer activation event. */
    handleCompactAudioPointer(event) {
        event.preventDefault();
        this.toggleAllAudioSetting();
    }

    /** @param {MouseEvent} event - Native or keyboard-generated click. */
    handleCompactAudioKeyboardClick(event) {
        if (event.detail === 0) {
            this.toggleAllAudioSetting();
        }
    }

    /** Registers all music and sound toggle listeners. */
    bindAudioToggleButtons() {
        this.bindButton('musicSettingButton', () => {
            this.toggleMusicSetting();
        });
        this.bindButton('soundSettingButton', () => {
            this.toggleSoundSetting();
        });
        this.bindMainAudioToggleButtons();
    }

    /** Registers main-menu music and sound toggle listeners. */
    bindMainAudioToggleButtons() {
        this.bindButton('mainMusicSettingButton', () => {
            this.toggleMusicSetting();
        });
        this.bindButton('mainSoundSettingButton', () => {
            this.toggleSoundSetting();
        });
    }

    /** Registers in-game and main-menu audio volume controls. */
    bindAudioVolumeControls() {
        this.bindMusicVolumeControls();
        this.bindSoundVolumeControls();
    }

    /** Registers both music volume range inputs. */
    bindMusicVolumeControls() {
        this.bindRangeInput('musicVolumeSlider', (event) => {
            this.handleMusicVolumeChange(event);
        });
        this.bindRangeInput('mainMusicVolumeSlider', (event) => {
            this.handleMusicVolumeChange(event);
        });
    }

    /** Registers both sound volume range inputs. */
    bindSoundVolumeControls() {
        this.bindRangeInput('soundVolumeSlider', (event) => {
            this.handleSoundVolumeChange(event);
        });
        this.bindRangeInput('mainSoundVolumeSlider', (event) => {
            this.handleSoundVolumeChange(event);
        });
    }

    /** Toggles music and synchronizes every audio control. */
    toggleMusicSetting() {
        this.audioManager.unlock();
        this.audioManager.toggleMusic();
        this.updateAudioControls();
    }

    /** Toggles sound effects and synchronizes every audio control. */
    toggleSoundSetting() {
        this.audioManager.toggleSound();
        this.updateAudioControls();
    }

    /** Toggles music and effects through the compact audio control. */
    toggleAllAudioSetting() {
        this.audioManager.unlock(false);
        const shouldEnable = !this.areAllAudioChannelsEnabled();
        this.setMusicEnabledIfNeeded(shouldEnable);
        this.setSoundEnabledIfNeeded(shouldEnable);
        this.updateAudioControls();
    }

    /** @returns {boolean} Whether music and sound effects are enabled. */
    areAllAudioChannelsEnabled() {
        return this.audioManager.isMusicEnabled() &&
            this.audioManager.isSoundEnabled();
    }

    /** @param {boolean} isEnabled - Required music state. */
    setMusicEnabledIfNeeded(isEnabled) {
        if (this.audioManager.isMusicEnabled() !== isEnabled) {
            this.audioManager.toggleMusic();
        }
    }

    /** @param {boolean} isEnabled - Required sound-effect state. */
    setSoundEnabledIfNeeded(isEnabled) {
        if (this.audioManager.isSoundEnabled() !== isEnabled) {
            this.audioManager.toggleSound();
        }
    }

    /** @param {Event} event - Music range-input event. */
    handleMusicVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setMusicVolumeByPercent(volume);
        this.updateAudioControls();
    }

    /** @param {Event} event - Sound range-input event. */
    handleSoundVolumeChange(event) {
        const volume = Number(event.currentTarget.value);
        this.audioManager.setSoundVolumeByPercent(volume);
        this.updateAudioControls();
    }

    /** Synchronizes every music, sound, and volume control. */
    updateAudioControls() {
        this.updateMusicButtons();
        this.updateSoundButtons();
        this.updateAudioSliders();
    }

    /** Synchronizes all music toggle controls. */
    updateMusicButtons() {
        this.updateMusicToggleButton();
        this.updateMusicSettingButton('musicSettingButton');
        this.updateMusicSettingButton('mainMusicSettingButton');
    }

    /** Locates and synchronizes the compact global audio control. */
    updateMusicToggleButton() {
        const button = document.getElementById('musicToggleButton');
        if (button) {
            this.applyMusicToggleButtonState(button);
        }
    }

    /** @param {HTMLButtonElement} button - Compact audio control. */
    applyMusicToggleButtonState(button) {
        const isEnabled = this.areAllAudioChannelsEnabled();
        button.textContent = isEnabled ? '🔊' : '🔇';
        button.classList.toggle('is-active', isEnabled);
        button.setAttribute('aria-pressed', String(isEnabled));
        button.setAttribute(
            'aria-label',
            isEnabled ? 'Audio ausschalten' : 'Audio einschalten'
        );
    }

    /** @param {string} buttonId - Music setting button identifier. */
    updateMusicSettingButton(buttonId) {
        const status = this.audioManager.isMusicEnabled() ? 'An' : 'Aus';
        this.updateText(buttonId, `Musik: ${status}`);
    }

    /** Synchronizes all sound-effect toggle controls. */
    updateSoundButtons() {
        this.updateSoundSettingButton('soundSettingButton');
        this.updateSoundSettingButton('mainSoundSettingButton');
    }

    /** @param {string} buttonId - Sound button identifier. */
    updateSoundSettingButton(buttonId) {
        const status = this.audioManager.isSoundEnabled() ? 'An' : 'Aus';
        this.updateText(buttonId, `Soundeffekte: ${status}`);
    }

    /** Synchronizes all audio volume range inputs. */
    updateAudioSliders() {
        const musicVolume = this.audioManager.getMusicVolumePercent();
        const soundVolume = this.audioManager.getSoundVolumePercent();
        this.updateMusicSliders(musicVolume);
        this.updateSoundSliders(soundVolume);
    }

    /** @param {number} volume - Current music volume percentage. */
    updateMusicSliders(volume) {
        this.updateRangeValue('musicVolumeSlider', volume);
        this.updateRangeValue('mainMusicVolumeSlider', volume);
    }

    /** @param {number} volume - Current sound volume percentage. */
    updateSoundSliders(volume) {
        this.updateRangeValue('soundVolumeSlider', volume);
        this.updateRangeValue('mainSoundVolumeSlider', volume);
    }

    /**
     * @param {string} buttonId - Button element identifier.
     * @param {Function} callback - Click callback to register.
     */
    bindButton(buttonId, callback) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', callback);
        }
    }

    /**
     * @param {string} inputId - Range input element identifier.
     * @param {Function} callback - Input callback to register.
     */
    bindRangeInput(inputId, callback) {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', callback);
        }
    }

    /**
     * @param {string} elementId - Text element identifier.
     * @param {string|number} text - New visible text content.
     */
    updateText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * @param {string} inputId - Range input identifier.
     * @param {number} value - Numeric value to display.
     */
    updateRangeValue(inputId, value) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = value;
        }
    }
}
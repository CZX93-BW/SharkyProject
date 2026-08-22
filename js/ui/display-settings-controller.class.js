'use strict';

class DisplaySettingsController {
    /** Creates the central display settings controller. */
    constructor() {
        this.root = document.documentElement;
        this.themeStorageKey = 'sharky-display-theme';
        this.themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        this.displayButtons = [];
    }

    /** Restores display settings and connects all controls. */
    initialize() {
        this.applyInitialTheme();
        this.displayButtons = Array.from(
            document.querySelectorAll('[data-display-action]')
        );
        this.bindDisplayButtons();
        this.bindDisplayEvents();
        this.updateControls();
    }

    /** Connects each display button to its configured action. */
    bindDisplayButtons() {
        this.displayButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.handleDisplayAction(button.dataset.displayAction);
            });
        });
    }

    /** Reacts to browser-level display changes. */
    bindDisplayEvents() {
        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenState();
        });
        this.bindThemePreferenceChange();
    }

    /** Uses the modern or legacy media query listener. */
    bindThemePreferenceChange() {
        const callback = () => this.applySystemThemeIfUnstored();

        if (this.themeMediaQuery.addEventListener) {
            this.themeMediaQuery.addEventListener('change', callback);
            return;
        }

        this.themeMediaQuery.addListener?.(callback);
    }

    /** Runs the action selected through a display button. */
    handleDisplayAction(action) {
        if (action === 'theme') {
            this.toggleTheme();
        }

        if (action === 'fullscreen') {
            this.toggleFullscreen();
        }
    }

    /** Applies a stored theme or the current system preference. */
    applyInitialTheme() {
        const storedTheme = this.getStoredTheme();
        const theme = storedTheme || this.getSystemTheme();
        this.applyTheme(theme, false);
    }

    /** Applies system changes only when no manual choice exists. */
    applySystemThemeIfUnstored() {
        if (!this.getStoredTheme()) {
            this.applyTheme(this.getSystemTheme(), false);
        }
    }

    /** Returns the browser's preferred color theme. */
    getSystemTheme() {
        return this.themeMediaQuery.matches ? 'light' : 'dark';
    }

    /** Switches between the light and dark color themes. */
    toggleTheme() {
        const nextTheme = this.isDarkTheme() ? 'light' : 'dark';
        this.applyTheme(nextTheme, true);
    }

    /** Applies and optionally stores one validated theme. */
    applyTheme(theme, shouldStore) {
        const safeTheme = theme === 'light' ? 'light' : 'dark';
        this.root.dataset.theme = safeTheme;

        if (shouldStore) {
            this.storeTheme(safeTheme);
        }

        this.updateControls();
    }

    /** Returns whether the dark theme is currently active. */
    isDarkTheme() {
        return this.root.dataset.theme === 'dark';
    }

    /** Safely reads the stored manual theme selection. */
    getStoredTheme() {
        try {
            const theme = window.localStorage.getItem(this.themeStorageKey);
            return theme === 'light' || theme === 'dark' ? theme : null;
        } catch (error) {
            return null;
        }
    }

    /** Safely stores a manual theme selection. */
    storeTheme(theme) {
        try {
            window.localStorage.setItem(this.themeStorageKey, theme);
        } catch (error) {
            console.warn('[DisplaySettings] Theme could not be stored.');
        }
    }

    /** Enters or exits browser fullscreen mode. */
    async toggleFullscreen() {
        if (!this.isFullscreenSupported()) {
            return;
        }

        try {
            await this.changeFullscreenState();
        } catch (error) {
            console.warn('[DisplaySettings] Fullscreen request failed.');
        }
    }

    /** Performs the appropriate fullscreen API request. */
    async changeFullscreenState() {
        if (this.isFullscreenActive()) {
            await document.exitFullscreen();
            return;
        }

        await this.root.requestFullscreen();
    }

    /** Returns whether the Fullscreen API is available. */
    isFullscreenSupported() {
        return typeof this.root.requestFullscreen === 'function' &&
            typeof document.exitFullscreen === 'function';
    }

    /** Returns whether any document element is fullscreen. */
    isFullscreenActive() {
        return Boolean(document.fullscreenElement);
    }

    /** Synchronizes the root state after browser fullscreen changes. */
    updateFullscreenState() {
        this.root.classList.toggle(
            'is-fullscreen',
            this.isFullscreenActive()
        );
        this.updateControls();
    }

    /** Synchronizes every theme and fullscreen control. */
    updateControls() {
        this.displayButtons.forEach((button) => {
            this.updateDisplayButton(button);
        });
    }

    /** Updates one display button according to its action. */
    updateDisplayButton(button) {
        if (button.dataset.displayAction === 'theme') {
            this.updateThemeButton(button);
            return;
        }

        this.updateFullscreenButton(button);
    }

    /** Shows the active color theme on one button. */
    updateThemeButton(button) {
        const isDark = this.isDarkTheme();
        this.setButtonText(
            button,
            `Darstellung: ${isDark ? 'Dunkel' : 'Hell'}`
        );
        button.setAttribute('aria-pressed', String(isDark));
    }

    /** Shows fullscreen availability and state on one button. */
    updateFullscreenButton(button) {
        const isActive = this.isFullscreenActive();
        const isCompact = button.dataset.displayCompact === 'true';
        const label = isCompact ? '⛶' :
            `Vollbild: ${isActive ? 'An' : 'Aus'}`;
        this.setButtonText(button, label);
        button.setAttribute('aria-pressed', String(isActive));
        button.setAttribute('aria-label', isActive ?
            'Vollbild beenden' : 'Vollbild aktivieren');
        button.disabled = !this.isFullscreenSupported();
    }

    /** Updates a nested label without removing supporting menu text. */
    setButtonText(button, text) {
        const label = button.querySelector?.('[data-display-label]');
        if (label) {
            label.textContent = text;
            return;
        }

        button.textContent = text;
    }
}
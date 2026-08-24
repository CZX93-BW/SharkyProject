import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createScriptContext,
    loadProjectScripts
} from './test-helpers.mjs';

/** Minimal audio element used to test playback without a browser. */
class FakeAudio {
    /** @param {string} source - Audio source path. */
    constructor(source) {
        this.source = source;
        this.currentTime = 0;
        this.volume = 1;
        this.loop = false;
        this.paused = true;
        this.ended = false;
        this.pauseCalls = 0;
        this.playCalls = 0;
    }

    /** @returns {FakeAudio} Independent copy used for one sound effect. */
    cloneNode() {
        return new FakeAudio(this.source);
    }

    /** Stores no listener because playback completion is not simulated. */
    addEventListener() {}

    /** Simulates browser preload without additional behavior. */
    load() {}

    /** @returns {Promise<void>} Successful simulated playback. */
    play() {
        this.playCalls += 1;
        this.paused = false;
        return Promise.resolve();
    }

    /** Records one simulated pause. */
    pause() {
        this.pauseCalls += 1;
        this.paused = true;
    }
}

/** @returns {Object} In-memory local-storage replacement. */
function createLocalStorage() {
    const values = new Map();
    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value)
    };
}

/** @returns {Object} Audio manager and test context. */
function createAudioManager() {
    const localStorage = createLocalStorage();
    const context = createScriptContext({
        Audio: FakeAudio,
        localStorage
    });
    loadProjectScripts(context, [
        'js/config/game-config.js',
        'js/config/asset-config.js',
        'js/systems/audio-manager.class.js'
    ], 'this.AudioManager = AudioManager;');
    return {
        manager: new context.AudioManager(),
        context,
        localStorage
    };
}

test('all music tracks and sound effects are registered', () => {
    const { manager } = createAudioManager();

    assert.deepEqual(
        Object.keys(manager.musicTracks),
        ['gameplay', 'boss']
    );
    assert.equal(Object.keys(manager.sounds).length, 16);
    assert.equal(manager.soundPools.coin.length, 4);
    assert.equal(manager.getMusicVolumePercent(), 40);
    assert.equal(manager.getSoundVolumePercent(), 40);
});

test('boss music replaces gameplay music after audio unlock', () => {
    const { manager } = createAudioManager();

    manager.unlock();

    assert.equal(manager.musicTracks.gameplay.playCalls, 1);

    manager.playBossMusic();

    assert.equal(manager.musicTracks.gameplay.pauseCalls, 1);
    assert.equal(manager.musicTracks.boss.playCalls, 1);
});

test('mute stops playback and persists across manager instances', () => {
    const { manager, context } = createAudioManager();

    manager.unlock();
    manager.setMuted(true);

    const restoredManager = new context.AudioManager();

    assert.equal(manager.isMuted(), true);
    assert.equal(restoredManager.isMuted(), true);
    assert.equal(restoredManager.isMusicEnabled(), false);
    assert.equal(restoredManager.isSoundEnabled(), false);
    assert.equal(
        manager.musicTracks.gameplay.pauseCalls > 0,
        true
    );

    restoredManager.toggleAllAudio();

    assert.equal(restoredManager.isAllAudioEnabled(), true);
});
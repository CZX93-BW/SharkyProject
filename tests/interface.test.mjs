import assert from 'node:assert/strict';
import test from 'node:test';
import { readProjectFile } from './test-helpers.mjs';

test('required game and touch controls exist in the interface', () => {
    const html = readProjectFile('index.html');
    const requiredIds = [
        'gameCanvas',
        'pausePlayButton',
        'openSettingsButton',
        'mobileJoystick',
        'mobileJoystickKnob'
    ];

    requiredIds.forEach((id) => {
        assert.match(html, new RegExp(`id="${id}"`));
    });

    ['slap', 'bubble', 'poison'].forEach((action) => {
        assert.match(
            html,
            new RegExp(`data-mobile-action="${action}"`)
        );
    });
});

test('responsive styles cover mobile landscape and reduced motion', () => {
    const responsiveCss = readProjectFile('styles/responsive.css');
    const menuCss = readProjectFile('styles/menu-screen.css');

    assert.match(responsiveCss, /orientation:\s*landscape/);
    assert.match(responsiveCss, /prefers-reduced-motion:\s*reduce/);
    assert.match(menuCss, /orientation:\s*landscape/);
});
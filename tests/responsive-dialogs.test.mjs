import assert from 'node:assert/strict';
import test from 'node:test';
import { readProjectFile } from './test-helpers.mjs';

test('landscape dialogs avoid unnecessary scrollbars', () => {
    const css = readProjectFile('styles/responsive.css');
    const landscapeCss = getLandscapeRules(css);

    assert.match(
        landscapeCss,
        /\.menu-overlay,[\s\S]*?\.ingame-dialog\s*\{[^}]*overflow:\s*hidden;/
    );
    assert.match(
        landscapeCss,
        /\.ingame-dialog-card \.settings-control-list,[\s\S]*?\{[^}]*grid-template-columns:\s*repeat\(2,/
    );
    assert.match(
        landscapeCss,
        /\.shop-content \.shop-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/
    );
});

test('touch dialog cards can scroll without a visible scrollbar', () => {
    const css = readProjectFile('styles/responsive.css');
    const landscapeCss = getLandscapeRules(css);

    assert.match(landscapeCss, /\.ingame-dialog-card\s*\{[^}]*overflow-y:\s*auto;/);
    assert.match(landscapeCss, /#settingsPanel \.panel-card\s*\{[^}]*overflow-y:\s*auto;/);
    assert.match(css, /@media \(pointer: coarse\)\s*\{[^}]*scrollbar-width:\s*none;/);
});

test('only touch landscape uses automatic viewport sizing, including short windows', () => {
    const css = readProjectFile('styles/responsive.css');
    const screenManager = readProjectFile(
        'js/ui/screen-manager.class.js'
    );
    const mainScript = readProjectFile('js/main.js');

    assert.match(
        css,
        /html\.is-game-screen body,[\s\S]*?overflow:\s*hidden;/
    );
    assert.match(
        css,
        /html\.is-main-menu-screen \.main-menu-screen\s*\{[^}]*overflow:\s*hidden;/s
    );
    assert.match(
        screenManager,
        /classList\.toggle\(\s*'is-game-screen'/
    );
    const touchLandscape = '(pointer: coarse) and (orientation: landscape)';
    assert.ok(css.includes('@media ' + touchLandscape + ' {'));
    assert.doesNotMatch(css, /@media \(max-width:\s*1180px\) and \(orientation: landscape\)/);
    assert.ok(css.includes('@media (max-height: 620px) and ' + touchLandscape + ' {'));
    assert.ok(mainScript.includes(touchLandscape));
});

/**
 * @param {string} css - Complete responsive stylesheet.
 * @returns {string} Landscape rules used below 620 pixels height.
 */
function getLandscapeRules(css) {
    const start = css.indexOf(
        '@media (max-height: 620px)'
    );
    const end = css.indexOf(
        '@media (max-height: 430px)'
    );

    return css.slice(start, end);
}

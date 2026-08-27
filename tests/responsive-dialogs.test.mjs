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

test('scroll fallback is limited to extremely short viewports', () => {
    const css = readProjectFile('styles/responsive.css');

    assert.match(
        css,
        /@media \(max-height:\s*280px\) and \(orientation:\s*landscape\)/
    );
});

test('touch screens own the complete landscape viewport', () => {
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
    assert.match(mainScript, /getCanvasViewportWidth/);
});

/**
 * @param {string} css - Complete responsive stylesheet.
 * @returns {string} Landscape rules used below 620 pixels height.
 */
function getLandscapeRules(css) {
    const start = css.indexOf(
        '@media (max-height: 620px) and (orientation: landscape)'
    );
    const end = css.indexOf(
        '@media (max-height: 430px) and (orientation: landscape)'
    );

    return css.slice(start, end);
}

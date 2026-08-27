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
        /\.ingame-dialog-card \.settings-control-list\s*\{[^}]*grid-template-columns:\s*repeat\(2,/
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
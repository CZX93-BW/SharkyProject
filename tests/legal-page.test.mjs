import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { readProjectFile } from './test-helpers.mjs';

test('legal page combines imprint and privacy information', () => {
    const html = readProjectFile('legal.html');

    assert.match(html, /id="imprint"/);
    assert.match(html, /id="privacyPolicy"/);
    assert.match(html, /IONOS SE/);
    assert.match(html, /sharky-display-theme/);
    assert.match(html, /sharkyAudioSettings/);
});

test('interface links use the renamed legal page', () => {
    const html = readProjectFile('index.html');
    const legalLinks = html.match(/href="legal\.html"/g) ?? [];

    assert.equal(legalLinks.length, 2);
    assert.doesNotMatch(html, /href="imprint\.html"/);
});

test('legacy imprint file was removed', () => {
    const legacyFile = new URL('../imprint.html', import.meta.url);

    assert.equal(existsSync(legacyFile), false);
});

test('legal page remains scrollable in responsive layouts', () => {
    const css = readProjectFile('styles/legal.css');

    assert.match(
        css,
        /\.legal-page\s*\{[^}]*overflow-y:\s*auto;/s
    );
    assert.match(
        css,
        /max-height:\s*620px[\s\S]*?\.legal-page[\s\S]*?overflow-y:\s*auto;/
    );
});
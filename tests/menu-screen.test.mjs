import assert from 'node:assert/strict';
import test from 'node:test';
import { readProjectFile } from './test-helpers.mjs';

test('WASD keys use the expected visual positions', () => {
    const menuCss = readProjectFile('styles/menu-screen.css');
    const positions = [
        [1, 2, 1],
        [2, 1, 2],
        [3, 2, 2],
        [4, 3, 2]
    ];

    positions.forEach(([key, column, row]) => {
        assertKeyPosition(menuCss, key, column, row);
    });
});

/**
 * @param {string} css - Current menu stylesheet.
 * @param {number} key - Keyboard element position.
 * @param {number} column - Expected grid column.
 * @param {number} row - Expected grid row.
 */
function assertKeyPosition(css, key, column, row) {
    const selector = `.wasd-keyboard kbd:nth-of-type\\(${key}\\)`;
    const rule = new RegExp(
        `${selector}\\s*\\{[^}]*` +
        `grid-column:\\s*${column};[^}]*` +
        `grid-row:\\s*${row};`,
        's'
    );

    assert.match(css, rule);
}
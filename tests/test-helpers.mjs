import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const projectRoot = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..'
);

/**
 * @param {Object} [overrides={}] - Global values added to the context.
 * @returns {vm.Context} Isolated browser-like script context.
 */
export function createScriptContext(overrides = {}) {
    return vm.createContext({
        console,
        Date,
        Math,
        URLSearchParams,
        performance: { now: () => 0 },
        ...overrides
    });
}

/**
 * @param {vm.Context} context - Target script context.
 * @param {string[]} files - Root-relative scripts to load in order.
 * @param {string} exposure - Script exposing selected lexical bindings.
 * @returns {vm.Context} Updated script context.
 */
export function loadProjectScripts(context, files, exposure) {
    const source = files
        .map((file) => readProjectFile(file))
        .join('\n');

    vm.runInContext(`${source}\n${exposure}`, context);
    return context;
}

/**
 * @param {string} file - Root-relative project file path.
 * @returns {string} UTF-8 file content.
 */
export function readProjectFile(file) {
    return readFileSync(resolve(projectRoot, file), 'utf8');
}
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const projectRoot = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..'
);

/** Creates an isolated browser-like script context. */
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

/** Loads classic project scripts and exposes selected lexical bindings. */
export function loadProjectScripts(context, files, exposure) {
    const source = files
        .map((file) => readProjectFile(file))
        .join('\n');
    vm.runInContext(`${source}\n${exposure}`, context);
    return context;
}

/** Reads one project file as UTF-8 text. */
export function readProjectFile(file) {
    return readFileSync(resolve(projectRoot, file), 'utf8');
}

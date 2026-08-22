import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', '.deploy', 'node_modules']);
const errors = [];
const files = listFiles(projectRoot);
const metrics = {
    scripts: 0,
    stylesheets: 0,
    configuredAssets: 0
};

runValidation();

/** Runs every release validation and reports one combined result. */
function runValidation() {
    validateRequiredFiles();
    validateHtmlFiles();
    validateStylesheets();
    validateJavaScriptFiles();
    validateConfiguredAssets();
    validateReadme();
    validateForbiddenArtifacts();
    finishValidation();
}

/** Returns every project file except ignored local directories. */
function listFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const target = join(directory, entry.name);
        if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
            return listFiles(target);
        }

        return entry.isFile() ? [target] : [];
    });
}

/** Ensures release entry points and persistent audio folders exist. */
function validateRequiredFiles() {
    const requiredFiles = [
        'index.html',
        'imprint.html',
        'README.md',
        'robots.txt',
        'tests',
        'assets/audio/music/.gitkeep',
        'assets/audio/sfx/.gitkeep'
    ];
    requiredFiles.forEach((file) => validateExistingPath(file, 'Required file'));
}

/** Checks every HTML entry point and its local references. */
function validateHtmlFiles() {
    ['index.html', 'imprint.html'].forEach((file) => validateHtmlFile(file));
}

/** Validates resources and duplicate scripts in one HTML file. */
function validateHtmlFile(file) {
    const content = readProjectFile(file);
    const references = extractHtmlReferences(content);
    references.forEach((reference) => validateRelativeReference(file, reference));
    validateDuplicateScripts(file, content);

    if (file === 'index.html') {
        metrics.scripts = extractScriptSources(content).length;
    }
}

/** Extracts local src and href values from HTML content. */
function extractHtmlReferences(content) {
    return [...content.matchAll(/(?:src|href)="([^"]+)"/g)]
        .map((match) => match[1])
        .filter(isLocalReference);
}

/** Extracts external script file paths from HTML content. */
function extractScriptSources(content) {
    return [...content.matchAll(/<script\s+src="([^"]+)"/g)]
        .map((match) => match[1]);
}

/** Rejects duplicate script tags and an invalid application entry point. */
function validateDuplicateScripts(file, content) {
    const scripts = extractScriptSources(content);
    const duplicates = scripts.filter((script, index) => scripts.indexOf(script) !== index);
    duplicates.forEach((script) => addError(`${file}: duplicate script ${script}`));

    if (file === 'index.html' && scripts.at(-1) !== 'js/main.js') {
        addError('index.html: js/main.js must be the final script');
    }
}

/** Validates syntax and url references of every stylesheet. */
function validateStylesheets() {
    const stylesheets = files.filter((file) => extname(file) === '.css');
    metrics.stylesheets = stylesheets.length;
    stylesheets.forEach((file) => validateStylesheet(file));
}

/** Checks brace balance and local resources in one stylesheet. */
function validateStylesheet(file) {
    const content = readFileSync(file, 'utf8');
    const cleanedContent = stripCssCommentsAndStrings(content);
    const braceBalance = calculateBraceBalance(cleanedContent);
    const source = getRelativePath(file);
    if (braceBalance !== 0) addError(`${source}: unbalanced CSS braces`);
    extractCssReferences(content)
        .forEach((reference) => validateRelativeReference(source, reference));
}

/** Removes content that may contain non-structural brace characters. */
function stripCssCommentsAndStrings(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
}

/** Returns the opening minus closing CSS brace count. */
function calculateBraceBalance(content) {
    return [...content].reduce((sum, character) => {
        return sum + (character === '{') - (character === '}');
    }, 0);
}

/** Extracts local url values from CSS content. */
function extractCssReferences(content) {
    return [...content.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
        .map((match) => match[1])
        .filter(isLocalReference);
}

/** Runs the JavaScript parser against every JavaScript source file. */
function validateJavaScriptFiles() {
    files.filter(isJavaScriptFile).forEach((file) => validateJavaScriptFile(file));
}

/** Returns whether a file uses a supported JavaScript extension. */
function isJavaScriptFile(file) {
    return ['.js', '.mjs'].includes(extname(file));
}

/** Validates one JavaScript file without executing project code. */
function validateJavaScriptFile(file) {
    const result = spawnSync(process.execPath, ['--check', file], {
        encoding: 'utf8'
    });
    if (result.status !== 0) {
        addError(`${getRelativePath(file)}: ${result.stderr.trim()}`);
    }
}

/** Checks every runtime asset path stored in the central configuration. */
function validateConfiguredAssets() {
    const content = readProjectFile('js/config/asset-config.js');
    const assetPaths = [...content.matchAll(/['"](assets\/[^'"]+)['"]/g)]
        .map((match) => match[1]);
    const uniqueAssetPaths = [...new Set(assetPaths)];
    metrics.configuredAssets = uniqueAssetPaths.length;
    uniqueAssetPaths.forEach((file) => validateExistingPath(file, 'Configured asset'));
}

/** Checks local Markdown links and embedded images in the README. */
function validateReadme() {
    const content = readProjectFile('README.md');
    const markdownLinks = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
        .map((match) => match[1]);
    const images = [...content.matchAll(/<img[^>]+src="([^"]+)"/g)]
        .map((match) => match[1]);
    [...markdownLinks, ...images]
        .filter(isLocalReference)
        .forEach((reference) => validateRelativeReference('README.md', reference));
}

/** Rejects source archives, previews and explicitly legacy exports. */
function validateForbiddenArtifacts() {
    const patterns = [
        /\/Legacy\//i,
        /(?:preview|previwe|proposal).*\.gif$/i,
        /\.(?:ai|zip)$/i
    ];
    files.map(getRelativePath).forEach((file) => {
        if (patterns.some((pattern) => pattern.test(`/${file}`))) {
            addError(`Development artifact found: ${file}`);
        }
    });
}

/** Validates one path relative to its source file. */
function validateRelativeReference(sourceFile, reference) {
    const cleanReference = decodeURIComponent(reference.split(/[?#]/)[0]);
    const target = resolve(projectRoot, dirname(sourceFile), cleanReference);
    if (!existsSync(target)) {
        addError(`${sourceFile}: missing ${reference}`);
    }
}

/** Validates one root-relative project path. */
function validateExistingPath(file, label) {
    if (!existsSync(resolve(projectRoot, file))) {
        addError(`${label} missing: ${file}`);
    }
}

/** Returns whether a resource reference targets the local project. */
function isLocalReference(reference) {
    return !/^(?:#|[a-z]+:|\/\/)/i.test(reference);
}

/** Reads a UTF-8 project file by its root-relative path. */
function readProjectFile(file) {
    return readFileSync(resolve(projectRoot, file), 'utf8');
}

/** Returns a normalized project-relative path. */
function getRelativePath(file) {
    return relative(projectRoot, file).replaceAll('\\', '/');
}

/** Collects one validation failure without aborting later checks. */
function addError(message) {
    errors.push(message);
}

/** Prints the final validation result and sets the process status. */
function finishValidation() {
    if (errors.length > 0) {
        console.error(`Project validation failed with ${errors.length} error(s):`);
        errors.forEach((error) => console.error(`- ${error}`));
        process.exitCode = 1;
        return;
    }

    console.log('Sharky project validation passed.');
    console.log(`- ${metrics.scripts} HTML script references`);
    console.log(`- ${metrics.stylesheets} stylesheets`);
    console.log(`- ${metrics.configuredAssets} configured assets`);
}

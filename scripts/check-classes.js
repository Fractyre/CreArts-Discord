/* Flags Discord classes in the theme sources that no longer exist in the current Discord client.
 * Adapted from midnight-discord's check-classes.js.
 *
 *   npm run check-classes                 # check against the default class list (cached for 6h)
 *   npm run check-classes -- --refresh    # re-download the class list
 *
 * Accepts the itmesarah/DiscordClasses format ({ module: { key: "class" } }).
 * Pre-2024 classes (name-XXXXXX) are always reported. Exits 1 when dead classes are found. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SOURCE = 'https://raw.githubusercontent.com/itmesarah/DiscordClasses/main/discordclasses.json';
const CACHE_FILE = path.join(root, '.theme-dev', 'classes.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
// Discord's hashed class names: readable name, underscore(s), 5-6 hex chars. e.g. listItem__650eb, grabber_ec237e.
const CLASS_PATTERN = /\.(-?[A-Za-z_][\w-]*?_[0-9a-f]{5,6})(?![\w-])/g;
// Pre-2024 hashed class names: readable name, dash, 6 chars. e.g. sidebar-1tnWFu. Mixed case or digit required in the hash.
const LEGACY_PATTERN = /\.([A-Za-z]\w*-(?=[\w-]{0,5}[A-Z0-9_-])[\w-]{6})(?![\w-])/g;
// compiled outputs of the .scss files are skipped
const SKIP = /(^src[\\/]source\.css$)|(^modules[\\/]custom[\\/]\w+\.css$)/;

async function loadSource() {
    const cached = fs.existsSync(CACHE_FILE) && JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (cached && cached.source === SOURCE && Date.now() - cached.fetchedAt < CACHE_TTL_MS && !process.argv.includes('--refresh')) {
        return cached.data;
    }
    const response = await fetch(SOURCE);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${SOURCE}`);
    const data = await response.json();
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ source: SOURCE, fetchedAt: Date.now(), data }));
    return data;
}

function classesFrom(data) {
    const classes = new Set();
    for (const module of Object.values(data)) {
        const values = Object.values(module).filter((value) => typeof value === 'string');
        // composed values look like "button_abc123 base_def456"; every token is a real class
        for (const value of values) for (const name of value.split(' ')) if (name) classes.add(name);
    }
    return classes;
}

const readableName = (name) => name.replace(/_+[0-9a-f]{5,6}$/, '').replace(/-[\w-]{6}$/, '');

function sourceFiles() {
    const files = ['clients/crearts.theme.css', 'dev.scss'];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
            const rel = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(rel);
            else if (/\.s?css$/.test(entry.name) && !SKIP.test(rel)) files.push(rel);
        }
    };
    ['src', 'modules', 'skins'].forEach(walk);
    return files;
}

function usedClasses() {
    const used = [];
    for (const file of sourceFiles()) {
        const text = fs.readFileSync(path.join(root, file), 'utf8');
        // blank out comments but keep newlines so line numbers stay right
        const stripped = text
            .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
            .replace(/(^|[^:])\/\/.*$/gm, (comment, prefix) => prefix + comment.slice(prefix.length).replace(/./g, ' '))
            .replace(/url\([^)]*\)/g, (url) => url.replace(/./g, ' '));
        const lines = text.split('\n');
        stripped.split('\n').forEach((line, index) => {
            for (const pattern of [CLASS_PATTERN, LEGACY_PATTERN]) {
                for (const match of line.matchAll(pattern)) {
                    used.push({ name: match[1], file: file.replace(/\\/g, '/'), line: index + 1, text: lines[index].trim() });
                }
            }
        });
    }
    return used;
}

async function main() {
    const live = classesFrom(await loadSource());
    const byName = new Map();
    for (const name of live) {
        const key = readableName(name);
        if (!byName.has(key)) byName.set(key, []);
        byName.get(key).push(name);
    }

    const used = usedClasses();
    const dead = used.filter((use) => !live.has(use.name));
    const deadNames = [...new Set(dead.map((use) => use.name))];
    console.log(`${new Set(used.map((use) => use.name)).size} Discord classes checked, ${deadNames.length} not found in the current client.`);
    for (const name of deadNames) {
        const sameName = byName.get(readableName(name)) || [];
        const hint = sameName.length === 0 ? 'no current class with this name'
            : sameName.length <= 3 ? `current classes with this name: ${sameName.join(', ')}`
                : `${sameName.length} current classes with this name (ambiguous)`;
        console.log(`\n${name} — ${hint}`);
        for (const use of dead.filter((use) => use.name === name)) console.log(`  ${use.file}:${use.line}  ${use.text}`);
    }
    process.exitCode = deadNames.length ? 1 : 0;
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 2;
});

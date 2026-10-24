/* Compiles dev.scss into BetterDiscord's themes folder on every change; BD hot-reloads it.
 *
 *   npm run dev
 *   BD_THEMES=<path> npm run dev   # override the themes folder
 *
 * Enable "CreArts Dev" in BetterDiscord's theme settings. */

const fs = require('fs');
const path = require('path');
const sass = require('sass');

const root = path.join(__dirname, '..');
const themes = process.env.BD_THEMES || path.join(process.env.APPDATA || '', 'BetterDiscord', 'themes');
const out = path.join(themes, 'crearts-dev.theme.css');
const header = `/**
 * @name CreArts Dev
 * @version dev
 * @author Fractyre
 * @description Local build of CreArts from dev.scss.
*/
`;

function build() {
    try {
        fs.writeFileSync(out, header + sass.compile(path.join(root, 'dev.scss'), { loadPaths: [root] }).css);
        console.log(`${new Date().toLocaleTimeString()} wrote ${out}`);
    } catch (error) {
        console.error(error.message);
    }
}

let timer;
for (const dir of ['src', 'modules', 'skins']) {
    fs.watch(path.join(root, dir), { recursive: true }, (event, file) => {
        if (!/\.s?css$/.test(file || '') || /^source\.css$|custom[\\/]\w+\.css$/.test(file)) return;
        clearTimeout(timer);
        timer = setTimeout(build, 100);
    });
}
fs.watch(path.join(root, 'dev.scss'), () => (clearTimeout(timer), (timer = setTimeout(build, 100))));
build();

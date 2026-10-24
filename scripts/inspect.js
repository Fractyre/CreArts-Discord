/* Paste into Discord's DevTools console (Ctrl+Shift+I) to dump live DOM structure for theming.
 * Copies an indented tree to the clipboard: tag.classes "aria-label" [x,y wxh] plus any non-default
 * position, margin, padding, background, radius, overflow, opacity, flex and visibility.
 *
 *   inspect('.form_f75fb0')            // chat bar, 8 levels, 6 children per node
 *   inspect('.guilds__5e434', 4, 12)   // server list, 4 levels, 12 children per node
 *   inspect('.sidebar__5e434', 9, 4, true)  // also report which CreArts color variable each text color matches
 *
 * Read-only: it changes nothing on the page. */
function inspect(selector, maxDepth = 8, fan = 6, colors = false) {
    const out = [];
    const cs = (e) => getComputedStyle(e);
    const vars = ['text-muted', 'interactive-muted', 'interactive-normal', 'channels-default', 'text-default',
        'text-subtle', 'text-strong', 'text-normal', 'header-primary', 'header-secondary'];
    const colorVars = (el) => {
        const probe = document.createElement('span');
        el.appendChild(probe);
        const hits = vars.filter((v) => (probe.style.color = `var(--${v})`, cs(probe).color === cs(el).color));
        probe.remove();
        return hits.join('|');
    };
    const line = (e, d) => {
        const r = e.getBoundingClientRect(), s = cs(e);
        const cls = [...e.classList].filter((c) => !c.startsWith('theme-')).join('.');
        const attrs = ['aria-label', 'data-list-item-id'].map((a) => e.getAttribute(a) ? ` ${a === 'aria-label' ? '' : a + '='}"${e.getAttribute(a).slice(0, 30)}"` : '').join('');
        const box = (p) => ['Top', 'Right', 'Bottom', 'Left'].map((x) => parseFloat(s[p + x]) | 0).join(' ');
        const extra = [
            s.position !== 'static' && s.position,
            s.display === 'none' && 'HIDDEN',
            s.visibility === 'hidden' && 'INVISIBLE',
            +s.opacity < 1 && `op=${s.opacity}`,
            s.display.includes('flex') && `flex-${s.flexDirection}`,
            box('margin') !== '0 0 0 0' && `m=${box('margin')}`,
            box('padding') !== '0 0 0 0' && `p=${box('padding')}`,
            s.backgroundColor !== 'rgba(0, 0, 0, 0)' && `bg=${s.backgroundColor}`,
            s.borderTopLeftRadius !== '0px' && `r=${s.borderTopLeftRadius}`,
            s.overflow !== 'visible' && `ovf=${s.overflow}`,
            s.maskImage && s.maskImage !== 'none' && 'MASK',
            s.zIndex !== 'auto' && `z=${s.zIndex}`,
            colors && e.childElementCount === 0 && e.textContent.trim() && `color=${s.color} [${colorVars(e)}]`,
        ].filter(Boolean).join(' ');
        return `${'  '.repeat(d)}${e.tagName.toLowerCase()}${cls ? '.' + cls : ''}${attrs} [${r.x | 0},${r.y | 0} ${r.width | 0}x${r.height | 0}] ${extra}`;
    };
    const walk = (e, d) => {
        out.push(line(e, d));
        if (d >= maxDepth || e.tagName === 'svg' || e.getAttribute('role') === 'textbox') return;
        const kids = [...e.children];
        kids.slice(0, fan).forEach((k) => walk(k, d + 1));
        if (kids.length > fan) out.push(`${'  '.repeat(d + 1)}... +${kids.length - fan} more`);
    };
    const root = document.querySelector(selector);
    if (!root) return `nothing matches ${selector}`;
    walk(root, 0);
    copy(out.join('\n'));
    return `copied ${out.length} lines`;
}

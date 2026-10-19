#!/usr/bin/env node
// Regenerates frontend/src/content/projects.json from the repositories pinned on a GitHub profile.
//
//   GITHUB_TOKEN=... node scripts/pinned-projects.js [github-user]
//
// The token is optional; without it GitHub allows 60 API requests per hour from one address.
// Each project becomes a file in the site's `projects` directory, readable with `cat <name>`.
const fs = require('fs');
const path = require('path');

const USER = process.argv[2] || 'Mishallic';
const OUT = path.join(__dirname, '..', 'frontend', 'src', 'content', 'projects.json');
const README_MAX = 8000;
const headers = {
    'User-Agent': 'personal-website-content',
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN ? {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`} : {}),
};

async function getJson(url) {
    const res = await fetch(url, {headers});
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return res.json();
}

// The pinned list is only exposed through GraphQL (token required), so read it off the public profile page.
async function pinnedRepos(user) {
    const res = await fetch(`https://github.com/${user}`, {headers: {'User-Agent': headers['User-Agent']}});
    if (!res.ok) throw new Error(`https://github.com/${user} -> HTTP ${res.status}`);
    const html = await res.text();
    const repos = [];
    for (const chunk of html.split('pinned-item-list-item').slice(1)) {
        const m = chunk.match(/href="\/([^/"]+)\/([^/"?#]+)"/);
        if (m && !repos.some(r => r.owner === m[1] && r.name === m[2])) repos.push({owner: m[1], name: m[2]});
    }
    return repos;
}

async function readme(owner, name) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`,
        {headers: {...headers, Accept: 'application/vnd.github.raw'}});
    return res.ok ? res.text() : '';
}

// Apply fn to the prose only, leaving fenced code blocks untouched.
const outsideCode = (text, fn) => text.split(/(```[\s\S]*?```)/).map((part, i) => i % 2 ? part : fn(part)).join('');

// Make a README readable inside the site: absolute links and images, no raw html, bounded length.
function cleanReadme(text, {owner, name, branch, url}) {
    const blob = `https://github.com/${owner}/${name}/blob/${branch}/`;
    const raw = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/`;
    const absolute = (base, target) => /^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target) ? target : base + target.replace(/^\.?\//, '');
    let body = text.replace(/\r\n/g, '\n').trim();
    body = outsideCode(body, prose => prose
        .replace(/<(https?:\/\/[^>\s]+)>/g, '$1')
        .replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, (m, src) => `![](${absolute(raw, src)})`)
        .replace(/<\/?[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?\/?>/g, '')
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => `![${alt}](${absolute(raw, src)})`)
        .replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => `[${label}](${absolute(blob, href)})`)
    );
    body = body.replace(/^#\s+.*\n+/, ''); // the entry gets its own title
    if (body.length > README_MAX) {
        const cut = body.lastIndexOf('\n\n', README_MAX);
        body = body.slice(0, cut > 0 ? cut : README_MAX).trim() + `\n\n…\n\n[Read the full README on GitHub](${url}#readme)`;
    }
    return body.trim();
}

function compose(meta, body) {
    const lines = [`# ${meta.name}`, ''];
    if (meta.description) lines.push(meta.description, '');
    lines.push(`- 🔗 **Repository:** ${meta.url}`);
    if (meta.homepage) lines.push(`- 🌐 **Website:** ${meta.homepage}`);
    if (meta.language) lines.push(`- **Language:** ${meta.language}`);
    if (meta.topics.length) lines.push(`- **Topics:** ${meta.topics.join(', ')}`);
    lines.push(`- **Last update:** ${meta.pushed_at.slice(0, 10)}`, '');
    if (body) lines.push('---', '', body, '');
    return lines.join('\n');
}

(async () => {
    const repos = await pinnedRepos(USER);
    if (!repos.length) throw new Error(`no pinned repositories found on https://github.com/${USER}`);
    const projects = [];
    for (const {owner, name} of repos) {
        const r = await getJson(`https://api.github.com/repos/${owner}/${name}`);
        const meta = {
            name: r.name, owner, description: r.description || '', url: r.html_url, homepage: r.homepage || '',
            language: r.language || '', topics: r.topics || [], pushed_at: r.pushed_at,
        };
        const body = cleanReadme(await readme(owner, name), {owner, name, branch: r.default_branch, url: r.html_url});
        projects.push({...meta, content: compose(meta, body)});
        console.log(`${name}: ${projects[projects.length - 1].content.length} chars`);
    }
    fs.mkdirSync(path.dirname(OUT), {recursive: true});
    fs.writeFileSync(OUT, JSON.stringify(projects, null, 2) + '\n');
    console.log(`wrote ${projects.length} projects to ${path.relative(process.cwd(), OUT)}`);
})().catch(err => {
    console.error(err.message);
    process.exit(1);
});

const fs = require('fs');
const path = require('path');

const dir = "d:\\Peter's GYM";
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

const regex = /(?:src|href|url)\s*=\s*["']?([^"'\s>#)]+)["']?|url\(["']?([^"'\s)]+)["']?\)/gi;

const found = new Set();
let match;

function check(str) {
    while ((match = regex.exec(str)) !== null) {
        let p = match[1] || match[2];
        if (p && !p.startsWith('http') && !p.startsWith('//') && !p.startsWith('data:') && !p.startsWith('tel:') && !p.startsWith('mailto:')) {
            p = p.replace(/^\.\//, '');
            found.add(p);
        }
    }
}

check(html);
check(css);
check(js);

console.log('--- ALL LOCAL ASSET REFERENCES ---');
found.forEach(asset => {
    const fullPath = path.join(dir, asset);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅ OK  ' : '❌ MISSING:'} ${asset}`);
});

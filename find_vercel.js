const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const paths = [
    path.join(home, 'AppData', 'Roaming', 'com.vercel.cli', 'auth.json'),
    path.join(home, '.vercel', 'auth.json'),
    path.join(home, 'AppData', 'Local', 'com.vercel.cli', 'auth.json'),
    path.join(home, '.config', 'vercel', 'auth.json'),
    path.join(home, 'AppData', 'Roaming', 'vercel', 'auth.json')
];

console.log('Searching for Vercel auth config...');
paths.forEach(p => {
    console.log(`Checking: ${p} - exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
        try {
            const data = fs.readFileSync(p, 'utf8');
            console.log(`Found config in ${p}:`, data);
        } catch (e) {
            console.error('Error reading', e);
        }
    }
});

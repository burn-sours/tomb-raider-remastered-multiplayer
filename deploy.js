const {execSync} = require('child_process');
const {exec: pkg} = require('pkg');
const fs = require('fs');
const path = require('path');

const packageJson = require('./package.json');
const version = packageJson.version;

const buildClient = async () => {
    console.log('Building client...');
    try {
        execSync('electron-builder -p never --win', {stdio: 'inherit'});
        console.log('Client build complete!');
    } catch (error) {
        console.error('Error occurred while running electron-builder:', error);
        throw error;
    }
};

const buildServer = async () => {
    console.log('Building server...');
    const outputDir = path.join(__dirname, 'releases');
    const outputExe = path.join(outputDir, `Burn's Multiplayer Server ${version}.exe`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
    }

    try {
        await pkg([
            'server/index.js',
            '--target', 'node18-win-x64',
            '--output', outputExe
        ]);

        console.log('Server build complete!');
    } catch (error) {
        console.error('Error occurred while building server:', error);
        throw error;
    }
};

(async () => {
    try {
        await buildClient();
        await buildServer();
        console.log('\nAll builds completed successfully!');
    } catch (error) {
        console.error('\nBuild failed:', error);
        process.exit(1);
    }
})();

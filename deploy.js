const {execSync} = require('child_process');

try {
    execSync('electron-builder -p never --win', {stdio: 'inherit'});
} catch (error) {
    console.error('Error occurred while running electron-builder:', error);
    process.exit(1);
}

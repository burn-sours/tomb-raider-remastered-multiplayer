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

const updateExecutableResources = async (exePath) => {
    const resedit = await import('resedit');

    const exe = resedit.NtExecutable.from(fs.readFileSync(exePath));
    const res = resedit.NtExecutableResource.from(exe);

    const iconPath = path.join(__dirname, 'client/ui/images/burn.ico');
    const iconFile = resedit.Data.IconFile.from(fs.readFileSync(iconPath));
    resedit.Resource.IconGroupEntry.replaceIconsForResource(
        res.entries,
        1,
        1033,
        iconFile.icons.map(item => item.data)
    );

    const vi = resedit.Resource.VersionInfo.fromEntries(res.entries)[0];
    vi.setStringValues(
        {lang: 1033, codepage: 1200},
        {
            ProductName: "Burn's Multiplayer Server",
            FileDescription: "Tomb Raider Remastered Multiplayer Server",
            CompanyName: "burn_sours",
            LegalCopyright: "Copyright © 2025 burn_sours",
            FileVersion: version,
            ProductVersion: version,
        }
    );
    vi.removeStringValue({lang: 1033, codepage: 1200}, 'OriginalFilename');
    vi.removeStringValue({lang: 1033, codepage: 1200}, 'InternalName');
    vi.setFileVersion(...version.split('.').map(Number), 0);
    vi.setProductVersion(...version.split('.').map(Number));
    vi.outputToResourceEntries(res.entries);

    res.outputResource(exe);
    fs.writeFileSync(exePath, Buffer.from(exe.generate()));
};

const buildServer = async () => {
    console.log('Building server...');
    const outputDir = path.join(__dirname, 'releases');
    const outputExe = path.join(outputDir, `Burn's Multiplayer Server ${version}.exe`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
    }

    await pkg([
        'server/index.js',
        '--target', 'node18-win-x64',
        '--output', outputExe
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        await updateExecutableResources(outputExe);
    } catch (error) {
        console.error('Failed to update executable resources:', error);
        throw error;
    }

    console.log('Server build complete!');
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

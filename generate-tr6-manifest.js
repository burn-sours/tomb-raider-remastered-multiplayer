const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yauzl = require('yauzl');

const MANIFEST_OUT = path.join(__dirname, 'client', 'games', 'trr-6', 'maps-manifest.json');

const usage = [
    'Usage: node generate-tr6-manifest.js <zip-path> <archive-url> [version] [displayVersion]',
    '',
    'Example:',
    '  node generate-tr6-manifest.js tr6-maps.zip "https://example.com/tr6-maps.zip" 1 v1',
    '',
    'Writes directly to ' + MANIFEST_OUT
].join('\n');

const [, , zipPath, archiveUrl, version = '1', displayVersion] = process.argv;
if (!zipPath || !archiveUrl) {
    console.error(usage);
    process.exit(1);
}
if (!fs.existsSync(zipPath)) {
    console.error('Zip not found: ' + zipPath);
    process.exit(1);
}

const hashFile = (p) => new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    fs.createReadStream(p)
        .on('data', d => h.update(d))
        .on('end', () => resolve(h.digest('hex')))
        .on('error', reject);
});

const hashZipEntries = (zp) => new Promise((resolve, reject) => {
    yauzl.open(zp, { lazyEntries: true }, (err, zip) => {
        if (err) return reject(err);
        const files = [];
        zip.on('entry', (entry) => {
            if (/\/$/.test(entry.fileName)) { zip.readEntry(); return; }
            zip.openReadStream(entry, (err, stream) => {
                if (err) return reject(err);
                const h = crypto.createHash('sha256');
                let size = 0;
                stream.on('data', d => { h.update(d); size += d.length; });
                stream.on('end', () => {
                    files.push({
                        name: path.basename(entry.fileName),
                        sha256: h.digest('hex'),
                        sizeBytes: size
                    });
                    zip.readEntry();
                });
                stream.on('error', reject);
            });
        });
        zip.on('end', () => resolve(files));
        zip.on('error', reject);
        zip.readEntry();
    });
});

(async () => {
    const stat = fs.statSync(zipPath);
    const [archiveSha256, files] = await Promise.all([
        hashFile(zipPath),
        hashZipEntries(zipPath)
    ]);
    const manifest = {
        version,
        ...(displayVersion ? { displayVersion } : {}),
        archiveUrl,
        archiveSha256,
        archiveSizeBytes: stat.size,
        files: files.sort((a, b) => a.name.localeCompare(b.name))
    };
    fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 4) + '\n', 'utf8');
    console.log('Wrote ' + MANIFEST_OUT);
    console.log('  archiveSha256:    ' + archiveSha256);
    console.log('  archiveSizeBytes: ' + stat.size);
    console.log('  files:            ' + files.length);
})().catch(err => {
    console.error('Failed: ' + (err && err.message || err));
    process.exit(1);
});

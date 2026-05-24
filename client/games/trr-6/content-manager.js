const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createWriteStream } = require('fs');
const extract = require('extract-zip');

const MANIFEST_PATH = path.join(__dirname, 'maps-manifest.json');
const STATE_FILENAME = '.install-state.json';
const TEMP_DOWNLOAD_FILENAME = '.download.tmp';
const PROGRESS_THROTTLE_MS = 200;

let mapsDir = null;
let manifestCache = null;
let activeDownload = null;

const setMapsDir = (dir) => { mapsDir = dir; };

const readManifest = () => {
    if (manifestCache) return manifestCache;
    try {
        manifestCache = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (err) {
        manifestCache = null;
    }
    return manifestCache;
};

const readInstallState = () => {
    if (!mapsDir) return null;
    try {
        return JSON.parse(fs.readFileSync(path.join(mapsDir, STATE_FILENAME), 'utf8'));
    } catch (err) {
        return null;
    }
};

const writeInstallState = (state) => {
    if (!mapsDir) return;
    try {
        fs.mkdirSync(mapsDir, { recursive: true });
        fs.writeFileSync(path.join(mapsDir, STATE_FILENAME), JSON.stringify(state, null, 2));
    } catch (err) { }
};

const statOrNull = (p) => {
    try { return fs.statSync(p); } catch (err) { return null; }
};

const hashFile = (p) => new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    const s = fs.createReadStream(p);
    s.on('data', d => h.update(d));
    s.on('end', () => resolve(h.digest('hex')));
    s.on('error', reject);
});

const validateFile = async (entry, cachedState) => {
    const p = path.join(mapsDir, entry.name);
    const stat = statOrNull(p);
    if (!stat) return { name: entry.name, ok: false, reason: 'missing' };

    if (process.env.DEV_SKIP_MAP_VALIDATION === 'true')
        return { name: entry.name, ok: true, sha256: entry.sha256, sizeBytes: stat.size, mtimeMs: stat.mtimeMs };

    if (stat.size !== entry.sizeBytes)
        return { name: entry.name, ok: false, reason: 'size' };

    const cached = cachedState && cachedState.files
        ? cachedState.files.find(f => f.name === entry.name)
        : null;
    if (cached
        && cached.sizeBytes === stat.size
        && cached.mtimeMs === stat.mtimeMs
        && cached.sha256 === entry.sha256) {
        return { name: entry.name, ok: true, sha256: cached.sha256, sizeBytes: stat.size, mtimeMs: stat.mtimeMs };
    }

    const sha = await hashFile(p);
    if (sha !== entry.sha256) return { name: entry.name, ok: false, reason: 'sha', actualSha: sha };
    return { name: entry.name, ok: true, sha256: sha, sizeBytes: stat.size, mtimeMs: stat.mtimeMs };
};

const getStatus = async ({ onProgress } = {}) => {
    const manifest = readManifest();
    if (!manifest || !manifest.archiveUrl || !Array.isArray(manifest.files) || manifest.files.length === 0) {
        return { state: 'error', message: 'Maps manifest is missing or invalid', manifest };
    }
    if (!mapsDir) {
        return { state: 'error', message: 'maps dir not initialized', manifest };
    }

    const cached = readInstallState();
    if (cached && cached.manifestVersion && cached.manifestVersion !== manifest.version) {
        return { state: 'outdated', manifest, installedVersion: cached.manifestVersion };
    }

    const results = [];
    for (let i = 0; i < manifest.files.length; i++) {
        const entry = manifest.files[i];
        if (onProgress) onProgress({
            phase: 'verifying',
            currentFile: entry.name,
            fileIndex: i,
            totalFiles: manifest.files.length
        });
        results.push(await validateFile(entry, cached));
    }

    const missing = results.filter(r => !r.ok && r.reason === 'missing').map(r => r.name);
    const corrupted = results.filter(r => !r.ok && (r.reason === 'sha' || r.reason === 'size')).map(r => r.name);

    if (missing.length > 0) {
        return { state: 'not_installed', manifest, missing };
    }
    if (corrupted.length > 0) {
        return { state: 'corrupted', manifest, corrupted };
    }

    writeInstallState({
        manifestVersion: manifest.version,
        validatedAt: new Date().toISOString(),
        files: results.map(r => ({
            name: r.name,
            sizeBytes: r.sizeBytes,
            mtimeMs: r.mtimeMs,
            sha256: r.sha256
        }))
    });

    return { state: 'installed', manifest };
};

const downloadArchive = async ({ onProgress, signal }) => {
    const manifest = readManifest();
    if (!manifest || !manifest.archiveUrl || !Array.isArray(manifest.files) || manifest.files.length === 0) {
        throw new Error('Maps manifest is missing or invalid');
    }
    if (!mapsDir) throw new Error('maps dir not initialized');

    fs.mkdirSync(mapsDir, { recursive: true });
    const tempPath = path.join(mapsDir, TEMP_DOWNLOAD_FILENAME);

    let alreadyDownloaded = 0;
    const existingStat = statOrNull(tempPath);
    if (existingStat) {
        alreadyDownloaded = existingStat.size;
        if (alreadyDownloaded >= manifest.archiveSizeBytes) {
            alreadyDownloaded = 0;
            try { fs.unlinkSync(tempPath); } catch (err) { }
        }
    }

    const headers = {};
    if (alreadyDownloaded > 0) {
        headers['Range'] = 'bytes=' + alreadyDownloaded + '-';
    }

    if (onProgress) onProgress({
        phase: 'downloading',
        bytesDone: alreadyDownloaded,
        bytesTotal: manifest.archiveSizeBytes
    });

    const res = await fetch(manifest.archiveUrl, { headers, signal });
    if (!res.ok && res.status !== 206) {
        throw new Error('Download failed: HTTP ' + res.status);
    }
    const isResume = res.status === 206;
    if (!isResume && alreadyDownloaded > 0) {
        alreadyDownloaded = 0;
        try { fs.unlinkSync(tempPath); } catch (err) { }
    }

    const writer = createWriteStream(tempPath, { flags: isResume ? 'a' : 'w' });
    let bytesDone = alreadyDownloaded;
    let lastReport = Date.now();

    const reader = res.body.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (signal && signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }
            await new Promise((resolve, reject) => {
                writer.write(value, err => err ? reject(err) : resolve());
            });
            bytesDone += value.length;
            const now = Date.now();
            if (now - lastReport > PROGRESS_THROTTLE_MS) {
                lastReport = now;
                if (onProgress) onProgress({
                    phase: 'downloading',
                    bytesDone,
                    bytesTotal: manifest.archiveSizeBytes
                });
            }
        }
    } finally {
        await new Promise(resolve => writer.end(resolve));
    }

    if (onProgress) onProgress({
        phase: 'verifying-archive',
        bytesDone,
        bytesTotal: manifest.archiveSizeBytes
    });

    const archiveSha = await hashFile(tempPath);
    if (archiveSha !== manifest.archiveSha256) {
        try { fs.unlinkSync(tempPath); } catch (err) { }
        throw new Error('Archive SHA mismatch (expected ' + manifest.archiveSha256 + ', got ' + archiveSha + ')');
    }

    if (onProgress) onProgress({ phase: 'extracting' });

    await extract(tempPath, { dir: mapsDir });

    try { fs.unlinkSync(tempPath); } catch (err) { }

    if (onProgress) onProgress({ phase: 'verifying' });
    return await getStatus({ onProgress });
};

const startDownload = ({ onProgress, onComplete, onError }) => {
    if (activeDownload) return false;
    const controller = new AbortController();
    activeDownload = controller;
    downloadArchive({ onProgress, signal: controller.signal })
        .then((result) => { activeDownload = null; onComplete(result); })
        .catch((err) => {
            activeDownload = null;
            if (err && err.name === 'AbortError') onError({ aborted: true });
            else onError({ message: err.message || String(err) });
        });
    return true;
};

const cancelDownload = () => {
    if (!activeDownload) return false;
    activeDownload.abort();
    activeDownload = null;
    return true;
};

module.exports = {
    setMapsDir,
    getMapsDir: () => mapsDir,
    readManifest,
    getStatus,
    startDownload,
    cancelDownload,
    isDownloadActive: () => !!activeDownload
};

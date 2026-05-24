const { app, dialog, shell, ipcMain } = require('electron');
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.exit();

const fs = require('fs');
const path = require('path');
const logsDir = path.join(app.getPath('userData'), 'logs');
const logger = require('../shared/logger')(logsDir);
const { spawn } = require("child_process");
const dgram = require('dgram');
let socket = dgram.createSocket('udp4');
const userdata = require('./userdata');
const ui = require('./ui');
const tr6ContentManager = require('./games/trr-6/content-manager');
const tr6MapsDir = () => path.join(app.getPath('userData'), 'maps', 'trr-6');

const gameManifests = require("./games/manifest");
const gameClients = gameManifests.games.map(manifest => ({
    id: manifest.id,
    client: require(`./games/${manifest.id}/client`)(socket),
}));
const featureManifests = require("./features/manifest");
const featureOptions = featureManifests.features.flatMap(manifest => {
    const mainOption = {
        id: manifest.id,
        label: manifest.ui.label,
    };
    const altOptions = manifest.ui.altOptions?.map(altOption => ({
        id: altOption.id,
        label: altOption.label,
    })) ?? [];
    return [mainOption, ...altOptions];
});

let exiting = false;
let activeGameClient = null;
let activeUserData = {};

ui.setupApplicationMenu({ logsDir });

app.on('before-quit', () => app.releaseSingleInstanceLock());
app.on('second-instance', () => ui.focus());

ui.setupEvents({
    "launchGame": (e, launchOptions) => launchGame(launchOptions),
    "updateOptions": (e, launchOptions) => updateGame(launchOptions),
    "stopMods": () => stopMods(),
    "log": (e, m) => console.log(...m),
    "errorBox": (e, m) => dialog.showErrorBox(...m),
    "openMultiplayerTool": () => ui.createMultiplayerWindow(activeUserData),
    "featureAction": (e, { feature, action, data }) => activeGameClient?.gameFunctions?.callFeatureAction(feature, action, data),
    "getFeatureManifests": () => featureManifests,
    "openExternal": (e, url) => shell.openExternal(url)
});

ipcMain.handle('selectExeFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Executable Files', extensions: ['exe'] }],
        title: 'Select Game Executable'
    });
    return result.canceled ? null : result.filePaths[0];
});

tr6ContentManager.setMapsDir(tr6MapsDir());

ipcMain.handle('getTr6ContentStatus', async () => tr6ContentManager.getStatus());

ipcMain.handle('revalidateTr6Content', async () => tr6ContentManager.getStatus({
    onProgress: (payload) => ui.broadcast('tr6ContentProgress', payload)
}));

ipcMain.handle('openTr6MapsFolder', async () => {
    const dir = tr6MapsDir();
    try { fs.mkdirSync(dir, { recursive: true }); } catch (err) { }
    await shell.openPath(dir);
});

ipcMain.handle('downloadTr6Content', async () => {
    if (tr6ContentManager.isDownloadActive()) {
        return { started: false, reason: 'already-running' };
    }
    const started = tr6ContentManager.startDownload({
        onProgress: (payload) => ui.broadcast('tr6ContentProgress', payload),
        onComplete: (status) => ui.broadcast('tr6ContentDownloadComplete', status),
        onError: (err) => ui.broadcast('tr6ContentDownloadError', err)
    });
    return { started };
});

ipcMain.handle('cancelTr6Download', async () => {
    return { cancelled: tr6ContentManager.cancelDownload() };
});

app.whenReady().then(async () => {
    activeUserData = userdata.readOptions({
        game: 'trr-123',
        multiplayer: false,
        name: '',
        playerNamesMode: 2,
        lobbyCode: '',
        enableChat: true,
        customServer: false,
        serverIp: '',
        serverPort: '',
        activeTab: 'multiplayer',
        ...Object.fromEntries(featureOptions.map(option => [option.id, false]))
    });

    await ui.createWelcomeWindow();
});

app.on('window-all-closed', async () => process.platform !== 'darwin' && app.quit());
app.on('will-quit', async () => await cleanup());
process.on('exit', async () => await cleanup());

process.on('SIGHUP', async () => await cleanup() && app?.quit());
process.on('SIGTERM', async () => await cleanup() && app?.quit());
process.on('SIGINT', async () => await cleanup() && app?.quit());

process.on('uncaughtException', async (err) => {
    console.error('Unhandled exception:', err);
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (err) => {
    if (err && err.message === 'Script is destroyed') return;
    console.error('Unhandled rejection:', err);
    await cleanup();
    process.exit(1);
});

async function launchGame(launchOptions) {
    activeUserData = { ...activeUserData, ...launchOptions };

    ui.broadcast('modInjecting', { customExePath: launchOptions.customExePath });

    if (activeUserData.multiplayer && (!activeUserData.name || activeUserData.name.trim().length < 1)) {
        ui.broadcast('requiredInputFailed', { name: activeUserData.name });
        return;
    }

    if (activeUserData.multiplayer && activeUserData.privateSession && (!activeUserData.lobbyCode || activeUserData.lobbyCode.trim().length < 1)) {
        ui.broadcast('requiredInputFailed', { lobbyCode: activeUserData.lobbyCode });
        return;
    }

    if (activeUserData.customExePath) {
        const gameManifest = gameManifests.games.find(g => g.id === activeUserData.game);
        const selectedExe = path.basename(activeUserData.customExePath);
        if (gameManifest && selectedExe.toLowerCase() !== gameManifest.executable.toLowerCase()) {
            ui.broadcast('requiredInputFailed', { customExePath: activeUserData.customExePath });
            dialog.showErrorBox('Invalid Executable', `Selected game is ${gameManifest.name} which requires ${gameManifest.executable}, but you selected ${selectedExe}`);
            return;
        }
    }

    if (activeUserData.multiplayer && activeUserData.game === 'trr-6') {
        const contentStatus = await tr6ContentManager.getStatus();
        if (contentStatus.state !== 'installed') {
            ui.broadcast('requiredInputFailed', { tr6Content: contentStatus });
            return;
        }
    }

    const optionsToSave = { ...activeUserData };
    delete optionsToSave.manualPatch;
    userdata.writeOptions(optionsToSave);

    const setupSuccess = await setupFrida();
    if (setupSuccess === false) return;

    try {
        ui.broadcast('modInjected');

        await activeGameClient.launchGame(activeUserData);
    } catch (err) { }
}

async function updateGame(launchOptions) {
    if (!activeGameClient) {
        return await launchGame(launchOptions);
    }

    activeUserData = { ...activeUserData, ...launchOptions };

    if (activeUserData.multiplayer && (!activeUserData.name || activeUserData.name.trim().length < 1)) {
        ui.broadcast('requiredInputFailed', { name: activeUserData.name });
        return;
    }

    if (activeUserData.multiplayer && activeUserData.privateSession && (!activeUserData.lobbyCode || activeUserData.lobbyCode.trim().length < 1)) {
        ui.broadcast('requiredInputFailed', { lobbyCode: activeUserData.lobbyCode });
        return;
    }

    const optionsToSave = { ...activeUserData };
    delete optionsToSave.manualPatch;
    userdata.writeOptions(optionsToSave);

    ui.broadcast('modInjected');

    await activeGameClient.updateGame(activeUserData);
}

async function stopMods() {
    ui.broadcast('modStopping');

    if (activeGameClient) {
        console.log('Stopping mods...');

        activeGameClient.exiting = true;
        activeGameClient.stopLoops();
        await activeGameClient.sendDisconnect(activeUserData);

        await delay(100);

        try {
            socket.removeAllListeners();
            socket.close();
        } catch (err) { /**/ }

        socket = dgram.createSocket('udp4');
        gameClients.forEach(gc => gc.client.socket = socket);

        await delay(2000);

        await activeGameClient.cleanup();
        activeGameClient = null;

        console.log('Mods stopped and cleaned up');
    }

    ui.broadcast('modStopped');
}

async function setupFrida() {
    if (!activeGameClient) {
        activeGameClient = gameClients.find(c => c.id === activeUserData.game)?.client;
        if (!activeGameClient) {
            console.error("Invalid game client:", activeUserData.game);
            return false;
        }
        activeGameClient.exiting = false;
    }

    const customExePath = activeUserData.customExePath || null;
    if (customExePath && !activeGameClient?.session) {
        const isRunning = await activeGameClient.isProcessRunning(customExePath);
        if (!isRunning) {
            console.log(`Launching ${path.basename(customExePath)}...`);

            spawn(customExePath, [], {
                detached: false,
                stdio: 'inherit',
                cwd: path.dirname(customExePath)
            });

            await delay(2000);
        }
    }

    console.log('Attaching to game...');

    while (!activeGameClient.session) {
        try {
            const supported = await activeGameClient.setupSession(
                activeUserData.manualPatch || null,
                customExePath
            );
            if (!supported) {
                ui.broadcast('patchDetectionFailed', activeGameClient.getPatches());
                activeGameClient.resetSession();
                return false;
            }
        } catch (err) {
            activeGameClient?.resetSession();
            await delay(100);
        }
    }

    console.log('Setting up scripts...');

    await activeGameClient.setupGameScript(activeUserData);

    await activeGameClient.setupGame();
}

async function cleanup() {
    exiting = true;

    try {
        socket.removeAllListeners();
        socket.disconnect();
    } catch (err) { /**/ }

    if (activeGameClient) {
        activeGameClient.exiting = true;
        await activeGameClient.cleanup();
    }
}

async function delay(t) {
    return await new Promise(resolve => setTimeout(resolve, t));
}
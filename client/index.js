const { app, dialog, shell, ipcMain } = require('electron');
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.exit();

const {spawn} = require("child_process");
const path = require('path');
const dgram = require('dgram');
let socket = dgram.createSocket('udp4');
const userdata = require('./userdata');
const ui = require('./ui');

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

ui.setupApplicationMenu();

app.on('before-quit', () => app.releaseSingleInstanceLock());
app.on('second-instance', () => ui.focus());

ui.setupEvents({
    "launchGame": (e, launchOptions) => launchGame(launchOptions),
    "updateOptions": (e, launchOptions) => updateGame(launchOptions),
    "stopMods": () => stopMods(),
    "log": (e, m) => console.log(...m),
    "errorBox": (e, m) => dialog.showErrorBox(...m),
    "openMultiplayerTool": () => ui.createMultiplayerWindow(activeUserData),
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

app.whenReady().then(async () => {
    activeUserData = userdata.readOptions({
        game: 'trr-123',
        multiplayer: false,
        name: '',
        playerNamesMode: 2,
        lobbyCode: '',
        customServer: false,
        serverIp: '',
        serverPort: '',
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
    console.log('Multiplayer Mod is no longer running. [1]');
    await cleanup();
    process.exit(1);
});

process.on('unhandledRejection', async (err) => {
    console.error('Unhandled rejection:', err);
    console.log('Multiplayer Mod is no longer running. [2]');
    await cleanup();
    process.exit(1);
});

async function launchGame(launchOptions) {
    activeUserData = {...activeUserData, ...launchOptions};

    if (activeUserData.multiplayer && (!activeUserData.name || activeUserData.name.trim().length < 1)) {
        ui.sendLauncherMessage('requiredInputFailed', {name: activeUserData.name});
        return;
    }

    if (activeUserData.customExePath) {
        const gameManifest = gameManifests.games.find(g => g.id === activeUserData.game);
        const selectedExe = path.basename(activeUserData.customExePath);
        if (gameManifest && selectedExe.toLowerCase() !== gameManifest.executable.toLowerCase()) {
            ui.sendLauncherMessage('requiredInputFailed', {customExePath: activeUserData.customExePath});
            dialog.showErrorBox('Invalid Executable', `Selected game is ${gameManifest.name} which requires ${gameManifest.executable}, but you selected ${selectedExe}`);
            return;
        }
    }

    const optionsToSave = {...activeUserData};
    delete optionsToSave.manualPatch;
    userdata.writeOptions(optionsToSave);

    const setupSuccess = await setupFrida();
    if (setupSuccess === false) return;

    try {
        ui.sendLauncherMessage('modInjected');

        await activeGameClient.launchGame(activeUserData);
    } catch (err) {}
}

async function updateGame(launchOptions) {
    activeUserData = {...activeUserData, ...launchOptions};

    if (activeUserData.multiplayer && (!activeUserData.name || activeUserData.name.trim().length < 1)) {
        ui.sendLauncherMessage('requiredInputFailed', {name: activeUserData.name});
        return;
    }

    const optionsToSave = {...activeUserData};
    delete optionsToSave.manualPatch;
    userdata.writeOptions(optionsToSave);

    ui.sendLauncherMessage('modInjected');

    await activeGameClient.updateGame(activeUserData);
}

async function stopMods() {
    if (activeGameClient) {
        console.log('Stopping mods...');

        activeGameClient.exiting = true;
        activeGameClient.stopConnectionHealthCheck();
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

        console.log('Mods stopped and cleaned up successfully');
    }
    ui.sendLauncherMessage('modsStopped');
}

async function setupFrida() {
    if (!activeGameClient) {
        activeGameClient = gameClients.find(c => c.id === activeUserData.game)?.client;
        if (!activeGameClient) {
            console.error("Invalid game client for:", activeUserData.game);
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

    console.log('Attach to game process...');

    while (!activeGameClient.session) {
        try {
            const supported = await activeGameClient.setupSession(
                activeUserData.manualPatch || null,
                customExePath
            );
            if (!supported) {
                ui.sendLauncherMessage('patchDetectionFailed', activeGameClient.getPatches());
                activeGameClient.resetSession();
                return false;
            }
        } catch (err) {
            activeGameClient?.resetSession();
            await delay(100);
        }
    }

    console.log('Setting up game script...');

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

async function delay (t) {
    return await new Promise(resolve => setTimeout(resolve, t));
}
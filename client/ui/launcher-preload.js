const { contextBridge, ipcRenderer } = require('electron');

const launcherOptionsCallbacks = [];
const modAttachedCallbacks = [];
const serverConnectedCallbacks = [];
const connectionFailedCallbacks = [];
const versionOutdatedCallbacks = [];
const requiredInputFailedCallbacks = [];
const patchDetectionFailedCallbacks = [];
const modsStoppedCallbacks = [];
let launcherOptions = {};
let featureManifests = null;

ipcRenderer.on('launcherOptions', (e, _launcherOptions) => {
    launcherOptions = {...launcherOptions, ..._launcherOptions}
    launcherOptionsCallbacks.forEach(callback => callback(launcherOptions));
});

ipcRenderer.on('featureManifests', (e, manifests) => {
    featureManifests = manifests;
});

ipcRenderer.on('modInjected', (e) => {
    modAttachedCallbacks.forEach(callback => callback(launcherOptions));
});

ipcRenderer.on('serverConnected', (e, playerId) => {
    serverConnectedCallbacks.forEach(callback => callback(launcherOptions, playerId));
});

ipcRenderer.on('connectionFailed', (e) => {
    connectionFailedCallbacks.forEach(callback => callback(launcherOptions));
});

ipcRenderer.on('versionOutdated', (e) => {
    versionOutdatedCallbacks.forEach(callback => callback(launcherOptions));
});

ipcRenderer.on('requiredInputFailed', (e, input) => {
    requiredInputFailedCallbacks.forEach(callback => callback(launcherOptions, input));
});

ipcRenderer.on('patchDetectionFailed', (e, patches) => {
    patchDetectionFailedCallbacks.forEach(callback => callback(patches));
});

ipcRenderer.on('modsStopped', (e) => {
    modsStoppedCallbacks.forEach(callback => callback());
});

featureManifests = ipcRenderer.sendSync('getFeatureManifests');

contextBridge.exposeInMainWorld('api', {
    get featureManifests() { return featureManifests; },

    onLauncherOptions: (callback) => {
        if (typeof callback === 'function') {
            launcherOptionsCallbacks.push(callback);
        }
    },
    onModAttached: (callback) => {
        if (typeof callback === 'function') {
            modAttachedCallbacks.push(callback);
        }
    },
    onServerConnected: (callback) => {
        if (typeof callback === 'function') {
            serverConnectedCallbacks.push(callback);
        }
    },
    onConnectionFailed: (callback) => {
        if (typeof callback === 'function') {
            connectionFailedCallbacks.push(callback);
        }
    },
    onVersionOutdated: (callback) => {
        if (typeof callback === 'function') {
            versionOutdatedCallbacks.push(callback);
        }
    },
    onRequiredInputFailed: (callback) => {
        if (typeof callback === 'function') {
            requiredInputFailedCallbacks.push(callback);
        }
    },
    onPatchDetectionFailed: (callback) => {
        if (typeof callback === 'function') {
            patchDetectionFailedCallbacks.push(callback);
        }
    },
    onModsStopped: (callback) => {
        if (typeof callback === 'function') {
            modsStoppedCallbacks.push(callback);
        }
    },

    updateGame: (data) => {
        launcherOptions = { ...launcherOptions, ...data };
        ipcRenderer.send('updateOptions', launcherOptions);
    },

    launchGame: (data) => {
        launcherOptions = { ...launcherOptions, ...data };
        ipcRenderer.send('launchGame', launcherOptions);
    },

    openExternal: (href) => {
        ipcRenderer.send('openExternal', href);
    },

    selectExeFile: async () => {
        return await ipcRenderer.invoke('selectExeFile');
    },

    stopMods: () => {
        ipcRenderer.send('stopMods');
    },

    log: (...m) => ipcRenderer.send('log', m),
    errorBox: (...m) => ipcRenderer.send('errorBox', m),
});
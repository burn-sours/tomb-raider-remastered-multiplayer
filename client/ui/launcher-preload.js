const { contextBridge, ipcRenderer } = require('electron');

const eventCallbacks = {};
let launcherOptions = {};
let featureManifests = null;

ipcRenderer.on('launcherOptions', (e, _launcherOptions) => {
    launcherOptions = {...launcherOptions, ..._launcherOptions}
    eventCallbacks['launcherOptions'].forEach(callback => callback(launcherOptions));
});

ipcRenderer.on('featureManifests', (e, manifests) => {
    featureManifests = manifests;
});

featureManifests = ipcRenderer.sendSync('getFeatureManifests');

contextBridge.exposeInMainWorld('api', {
    get featureManifests() { return featureManifests; },

    on: (eventName, callback) => {
        if (typeof callback === 'function') {
            if (!eventCallbacks[eventName]) {
                eventCallbacks[eventName] = [];
                ipcRenderer.on(eventName, (e, data) => {
                    eventCallbacks[eventName].forEach(cb => cb(data));
                });
            }
            eventCallbacks[eventName].push(callback);
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

    openStandaloneFeature: (featureId) => {
        ipcRenderer.send('openStandaloneFeature', featureId);
    },

    log: (...m) => ipcRenderer.send('log', m),
    errorBox: (...m) => ipcRenderer.send('errorBox', m),
});

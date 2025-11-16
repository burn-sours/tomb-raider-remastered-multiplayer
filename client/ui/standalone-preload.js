const { contextBridge, ipcRenderer } = require('electron');

const eventCallbacks = {};

contextBridge.exposeInMainWorld('api', {
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

    callFeatureAction: (feature, action, data) => {
        ipcRenderer.send('featureAction', {feature, action, data});
    },

    openExternal: (url) => {
        ipcRenderer.send('openExternal', url);
    },

    log: (...m) => ipcRenderer.send('log', m),
    errorBox: (...m) => ipcRenderer.send('errorBox', m),
});

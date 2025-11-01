const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openMultiplayerTool: () => {
        ipcRenderer.send('openMultiplayerTool');
    },
    openExternal: (href) => {
        ipcRenderer.send('openExternal', href);
    },
    log: (...m) => ipcRenderer.send('log', m),
});
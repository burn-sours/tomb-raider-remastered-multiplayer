const path = require('path');
const {Menu, shell, ipcMain, BrowserWindow} = require("electron");

module.exports = new class {
    constructor() {
        this.welcomeWindow = null;
        this.launcherWindow = null;
    }

    /**
     * Setup the main application menu
     */
    setupApplicationMenu() {
        Menu.setApplicationMenu(Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    { label: 'Close Mod', role: 'quit' }
                ]
            },
            {
                label: 'Links',
                submenu: [
                    {
                        label: 'Check for updates',
                        click: () => shell.openExternal('https://www.laracrofts.com/downloads/'),
                    },
                    {
                        label: 'Support the Multiplayer',
                        click: () => shell.openExternal('https://ko-fi.com/burn_sours'),
                    },
                    {
                        label: 'Contribute on GitHub',
                        click: () => shell.openExternal('https://github.com/burn-sours/tomb-raider-remastered-multiplayer'),
                    },
                    {
                        label: 'Join us on Burn\'s Discord',
                        click: () => shell.openExternal('https://discord.gg/DJrkR77HJD'),
                    },
                ]
            }
        ]));
    }

    /**
     * Setup ipc event handlers
     * @param events
     */
    setupEvents(events) {
        for (let event in events) {
            if (event === 'getFeatureManifests') {
                ipcMain.on(event, (e) => {
                    e.returnValue = events[event]();
                });
            } else {
                ipcMain.on(event, events[event]);
            }
        }
    }

    /**
     * Focus mod window
     */
    focus() {
        if (this.welcomeWindow) {
            if (this.welcomeWindow.isMinimized()) this.welcomeWindow.restore();
            this.welcomeWindow.focus();
        } else if (this.launcherWindow) {
            if (this.launcherWindow.isMinimized()) this.launcherWindow.restore();
            this.launcherWindow.focus();
        }
    }

    /**
     * Create the mod welcome interface
     * @returns {Promise<void>}
     */
    async createWelcomeWindow() {
        if (this.welcomeWindow) {
            this.welcomeWindow.focus();
            return;
        }

        const newWindow = new BrowserWindow({
            width: 400,
            height: 600,
            resizable: false,
            icon: path.join(__dirname, 'ui/images/burn.ico'),
            webPreferences: {
                preload: path.join(__dirname, 'ui/welcome-preload.js'),
                contextIsolation: true,
                devTools: true,
            }
        });

        await newWindow.loadFile(path.join(__dirname, 'ui/welcome.html'));

        newWindow.on('closed', () => this.welcomeWindow = null);

        this.welcomeWindow = newWindow;
    }

    /**
     * Send an event to the welcome interface
     * @param msg
     * @param data
     */
    sendWelcomeMessage(msg, data = {}) {
        this.welcomeWindow?.webContents.send(msg, data);
    }

    /**
     * Create the mod launcher interface
     * @param activeUserData
     * @returns {Promise<void>}
     */
    async createMultiplayerWindow(activeUserData) {
        if (this.launcherWindow) {
            this.launcherWindow.focus();
            return;
        }

        const newWindow = new BrowserWindow({
            width: 400,
            height: 600,
            x: this.welcomeWindow.getPosition()[0] || undefined,
            y: this.welcomeWindow.getPosition()[1] || undefined,
            resizable: false,
            icon: path.join(__dirname, 'ui/images/burn.ico'),
            webPreferences: {
                preload: path.join(__dirname, 'ui/launcher-preload.js'),
                contextIsolation: true,
                devTools: true,
            }
        });

        newWindow.on('closed', () => {
            this.launcherWindow = null;
        });

        await newWindow.loadFile(path.join(__dirname, 'ui/launcher.html'));

        this.launcherWindow = newWindow;

        if (this.launcherWindow) {
            this.sendLauncherMessage("launcherOptions", activeUserData);
        }

        if (this.welcomeWindow) {
            this.welcomeWindow.close();
        }
    }

    /**
     * Send an event to the launcher interface
     * @param msg
     * @param data
     */
    sendLauncherMessage(msg, data = {}) {
        this.launcherWindow?.webContents.send(msg, data);
    }
};
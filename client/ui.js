const path = require('path');
const {Menu, shell, ipcMain, BrowserWindow, app} = require("electron");

module.exports = new class {
    constructor() {
        this.welcomeWindow = null;
        this.launcherWindow = null;
        this.standaloneWindow = null;
        this.standaloneFeatureId = null;
    }

    /**
     * Setup the main application menu
     */
    setupApplicationMenu() {
        Menu.setApplicationMenu(Menu.buildFromTemplate([
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
                    {
                        label: 'Perma Damage Speedruns',
                        click: () => shell.openExternal('https://www.speedrun.com/tr123456_remastered_ce'),
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

            if (this.welcomeWindow) {
                this.welcomeWindow.close();
            }
            if (this.standaloneWindow) {
                this.standaloneWindow.close();
            }

            app.quit();
        });

        await newWindow.loadFile(path.join(__dirname, 'ui/launcher.html'));

        this.launcherWindow = newWindow;

        if (this.launcherWindow) {
            this.broadcast("launcherOptions", activeUserData);
        }

        if (this.welcomeWindow) {
            this.welcomeWindow.close();
        }
    }

    /**
     * Broadcast an event to all windows (welcome, launcher, standalone)
     * @param msg
     * @param data
     */
    broadcast(msg, data = {}) {
        this.welcomeWindow?.webContents.send(msg, data);
        this.launcherWindow?.webContents.send(msg, data);
        this.standaloneWindow?.webContents.send(msg, data);
    }

    /**
     * Create a standalone feature window
     * @param featureId
     * @param featureManifest
     * @param activeUserData
     * @returns {Promise<void>}
     */
    async createStandaloneWindow(featureId, featureManifest, activeUserData) {
        if (this.standaloneWindow) {
            await new Promise((resolve) => {
                this.standaloneWindow.once('closed', resolve);
                this.standaloneWindow.close();
            });
        }

        this.standaloneFeatureId = featureId;

        const windowTitle = featureManifest.ui?.windowTitle || featureManifest.name;

        const newWindow = new BrowserWindow({
            width: 400,
            height: 600,
            x: this.launcherWindow?.getPosition()[0] || undefined,
            y: this.launcherWindow?.getPosition()[1] || undefined,
            resizable: false,
            icon: path.join(__dirname, 'ui/images/burn.ico'),
            title: windowTitle,
            webPreferences: {
                preload: path.join(__dirname, 'ui/standalone-preload.js'),
                contextIsolation: true,
                devTools: true,
            }
        });

        newWindow.on('closed', () => {
            const closedFeatureId = this.standaloneFeatureId;
            this.standaloneWindow = null;
            this.standaloneFeatureId = null;
            ipcMain.emit('standaloneWindowClosed', closedFeatureId);
        });

        await newWindow.loadFile(path.join(__dirname, 'features', featureId, 'ui.html'));

        this.standaloneWindow = newWindow;

        if (this.standaloneWindow) {
            this.broadcast("launcherOptions", activeUserData);
        }

        if (this.welcomeWindow) {
            this.welcomeWindow.close();
        }
    }

};
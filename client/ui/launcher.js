let alreadyInjected = false;
let isLaunching = false;
let customExePath = null;
let activeTab = 'multiplayer';

const enableSaveButton = () => {
    if (isLaunching) return;
    const launchButton = document.getElementById("launchGameButton");
    launchButton.removeAttribute("disabled");
    if (alreadyInjected) {
        launchButton.innerText = "Re-launch Mods";
    }
};

function generateTabUI() {
    const { categories } = window.api.featureManifests;
    const currentGame = document.getElementById("gameSelect").value;
    const sidebarContainer = document.getElementById("tabSidebar");

    sidebarContainer.querySelectorAll(".sidebar-item").forEach(item => item.remove());
    sidebarContainer.appendChild(createSidebarItem("multiplayer", "Multiplayer", false));

    categories.forEach(category => {
        if (categoryHasFeatures(category.id, currentGame)) {
            sidebarContainer.appendChild(createSidebarItem(category.id, category.name, true));
        }
    });

    generateFeaturePanels();
    updateTabCounts();

    if (!document.querySelector(`.sidebar-item[data-tab="${activeTab}"]`)) {
        activeTab = "multiplayer";
    }
    switchTab(activeTab);
}

function createSidebarItem(id, name, showCount) {
    const item = document.createElement("button");
    item.className = "sidebar-item";
    item.dataset.tab = id;

    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    item.appendChild(nameSpan);

    if (showCount) {
        const countSpan = document.createElement("span");
        countSpan.className = "sidebar-item-count";
        countSpan.dataset.countFor = id;
        item.appendChild(countSpan);
    }

    item.addEventListener("click", () => switchTab(id));
    return item;
}

function updateTabCounts() {
    const { features, categories } = window.api.featureManifests;
    const currentGame = document.getElementById("gameSelect").value;

    categories.forEach(category => {
        const countSpan = document.querySelector(`.sidebar-item-count[data-count-for="${category.id}"]`);
        if (!countSpan) return;

        const categoryFeatures = features.filter(f =>
            f.category === category.id &&
            f.supportedGames.includes(currentGame)
        );

        const total = categoryFeatures.length;
        const selected = categoryFeatures.filter(f => {
            const checkbox = document.getElementById(f.id);
            return checkbox && checkbox.checked;
        }).length;

        countSpan.textContent = `${selected}/${total}`;
        countSpan.classList.toggle("has-selection", selected > 0);
    });
}

function categoryHasFeatures(categoryId, currentGame) {
    const { features } = window.api.featureManifests;
    return features.some(f =>
        f.category === categoryId &&
        f.supportedGames.includes(currentGame)
    );
}

function switchTab(tabId) {
    activeTab = tabId;

    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.classList.toggle("active", item.dataset.tab === tabId);
    });

    document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.dataset.panel === tabId);
    });
}

function generateFeaturePanels() {
    const panelsContainer = document.getElementById("tabPanels");
    const { features, categories } = window.api.featureManifests;
    const currentGame = document.getElementById("gameSelect").value;

    const savedStates = {};
    features.forEach(feature => {
        const checkbox = document.getElementById(feature.id);
        if (checkbox) savedStates[feature.id] = checkbox.checked;
        if (feature.ui.altOptions) {
            feature.ui.altOptions.forEach(alt => {
                const altCheckbox = document.getElementById(alt.id);
                if (altCheckbox) savedStates[alt.id] = altCheckbox.checked;
            });
        }
    });

    panelsContainer.querySelectorAll('.tab-panel:not([data-panel="multiplayer"])').forEach(p => p.remove());

    categories.forEach(category => {
        const categoryFeatures = features.filter(f =>
            f.category === category.id &&
            f.supportedGames.includes(currentGame)
        );

        if (categoryFeatures.length === 0) return;

        const panel = document.createElement("div");
        panel.className = "tab-panel";
        panel.dataset.panel = category.id;

        const heading = document.createElement("h3");
        heading.className = "subtitle";
        heading.textContent = category.name;
        panel.appendChild(heading);

        if (category.description) {
            const description = document.createElement("p");
            description.className = "tab-description";
            description.textContent = category.description;
            panel.appendChild(description);
        }

        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options";

        categoryFeatures.forEach(feature => {
            const label = document.createElement("label");
            label.className = "custom-checkbox";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = feature.id;
            checkbox.checked = savedStates[feature.id] || false;

            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";

            label.appendChild(checkbox);
            label.appendChild(checkmark);
            label.appendChild(document.createTextNode(feature.ui.label));
            optionsDiv.appendChild(label);

            if (feature.ui.altOptions && feature.ui.altOptions.length > 0) {
                const altContainer = document.createElement("div");
                altContainer.className = "alt-options";

                const separator = document.createElement("div");
                separator.className = "alt-options-separator";
                separator.textContent = "— OR —";
                altContainer.appendChild(separator);

                const altCheckboxes = [];

                feature.ui.altOptions.forEach(altOption => {
                    const altLabel = document.createElement("label");
                    altLabel.className = "custom-checkbox";

                    const altCheckbox = document.createElement("input");
                    altCheckbox.type = "checkbox";
                    altCheckbox.id = altOption.id;
                    altCheckbox.checked = savedStates[altOption.id] || false;

                    const altCheckmark = document.createElement("span");
                    altCheckmark.className = "checkmark";

                    altLabel.appendChild(altCheckbox);
                    altLabel.appendChild(altCheckmark);
                    altLabel.appendChild(document.createTextNode(altOption.label));
                    altContainer.appendChild(altLabel);

                    altCheckboxes.push(altCheckbox);

                    altCheckbox.addEventListener("change", () => {
                        if (altCheckbox.checked) {
                            checkbox.checked = false;
                        }
                        enableSaveButton();
                        updateTabCounts();
                    });
                });

                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        altCheckboxes.forEach(alt => alt.checked = false);
                    }
                    enableSaveButton();
                    updateTabCounts();
                });

                optionsDiv.appendChild(altContainer);
            } else {
                checkbox.addEventListener("change", () => {
                    enableSaveButton();
                    updateTabCounts();
                });
            }
        });

        panel.appendChild(optionsDiv);
        panelsContainer.appendChild(panel);
    });
}

const multiplayerCheckbox = document.getElementById("multiplayer");
const launchButton = document.getElementById("launchGameButton");
const stopModsButton = document.getElementById("stopModsButton");
const selectExeButton = document.getElementById("selectExeButton");
const gameSelect = document.getElementById("gameSelect");
const patchSection = document.getElementById("patchSection");
const patchSelect = document.getElementById("patchSelect");
const displayNameInput = document.getElementById("displayName");
const mpOptions = document.getElementById("mpOptions");

multiplayerCheckbox.addEventListener("change", () => {
    if (multiplayerCheckbox.checked) {
        mpOptions.classList.remove("hidden");
    } else {
        mpOptions.classList.add("hidden");
    }
    if (multiplayerCheckbox.checked && gameSelect.value === 'trr-6' && (tr6Content.state === 'unknown' || tr6Content.state === 'checking')) {
        refreshTr6Content();
    } else {
        updateTr6ContentVisibility();
    }
});

let tr6Content = { state: 'unknown' };
let tr6ContentRefreshing = false;

const formatBytes = (n) => {
    if (n === undefined || n === null) return '?';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1024 * 1024 * 1024) return (n / 1048576).toFixed(1) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
};

const tr6Section = document.getElementById('tr6ContentSection');
const tr6StatusEl = document.getElementById('tr6ContentStatus');
const tr6MessageEl = document.getElementById('tr6ContentMessage');
const tr6ProgressEl = document.getElementById('tr6ContentProgress');
const tr6ProgressFill = document.getElementById('tr6ContentProgressFill');
const tr6ProgressInfo = document.getElementById('tr6ContentProgressInfo');
const tr6PrimaryBtn = document.getElementById('tr6ContentPrimaryBtn');
const tr6CancelBtn = document.getElementById('tr6ContentCancelBtn');
const tr6RevalidateBtn = document.getElementById('tr6ContentRevalidateBtn');
const tr6OpenFolderBtn = document.getElementById('tr6ContentOpenFolderBtn');

function renderTr6ContentCard(uiState) {
    tr6ProgressEl.classList.add('hidden');
    tr6PrimaryBtn.classList.add('hidden');
    tr6CancelBtn.classList.add('hidden');
    tr6RevalidateBtn.classList.add('hidden');
    tr6Section.classList.remove('state-installed', 'state-error', 'state-busy', 'state-warning');
    tr6PrimaryBtn.dataset.action = '';

    const m = uiState.manifest;
    const sizeMB = m && m.archiveSizeBytes ? Math.round(m.archiveSizeBytes / 1048576) : null;

    switch (uiState.state) {
        case 'unknown':
        case 'checking':
            tr6StatusEl.textContent = 'Checking…';
            tr6MessageEl.textContent = 'Looking for installed maps…';
            tr6Section.classList.add('state-busy');
            break;
        case 'installed':
            tr6StatusEl.textContent = '✓ Installed' + (m && m.displayVersion ? ' (' + m.displayVersion + ')' : '');
            tr6Section.classList.add('state-installed');
            tr6MessageEl.textContent = 'Multiplayer maps verified.';
            tr6RevalidateBtn.classList.remove('hidden');
            break;
        case 'not_installed':
            tr6StatusEl.textContent = 'Required';
            tr6Section.classList.add('state-warning');
            tr6MessageEl.textContent = 'Multiplayer maps required.' +
                (sizeMB !== null ? ' Download size: ~' + sizeMB + ' MB.' : '');
            tr6PrimaryBtn.textContent = sizeMB !== null ? 'Download (' + sizeMB + ' MB)' : 'Download';
            tr6PrimaryBtn.dataset.action = 'download';
            tr6PrimaryBtn.classList.remove('hidden');
            tr6RevalidateBtn.classList.remove('hidden');
            break;
        case 'corrupted':
            tr6StatusEl.textContent = 'Corrupted';
            tr6Section.classList.add('state-error');
            tr6MessageEl.textContent = 'Some files have unexpected contents: ' +
                (uiState.corrupted || []).join(', ');
            tr6PrimaryBtn.textContent = 'Repair (re-download)';
            tr6PrimaryBtn.dataset.action = 'download';
            tr6PrimaryBtn.classList.remove('hidden');
            break;
        case 'outdated':
            tr6StatusEl.textContent = 'Update available';
            tr6Section.classList.add('state-warning');
            tr6MessageEl.textContent = 'Newer maps required for this version.';
            tr6PrimaryBtn.textContent = 'Download update';
            tr6PrimaryBtn.dataset.action = 'download';
            tr6PrimaryBtn.classList.remove('hidden');
            break;
        case 'downloading':
            tr6StatusEl.textContent = 'Downloading';
            tr6Section.classList.add('state-busy');
            tr6MessageEl.textContent = '';
            tr6ProgressEl.classList.remove('hidden');
            tr6ProgressFill.style.width = (uiState.progressPct || 0).toFixed(1) + '%';
            tr6ProgressInfo.textContent = uiState.progressInfo || '';
            tr6CancelBtn.classList.remove('hidden');
            break;
        case 'verifying-archive':
            tr6StatusEl.textContent = 'Verifying archive';
            tr6Section.classList.add('state-busy');
            tr6MessageEl.textContent = 'Checking download integrity…';
            break;
        case 'extracting':
            tr6StatusEl.textContent = 'Extracting';
            tr6Section.classList.add('state-busy');
            tr6MessageEl.textContent = 'Unpacking files into the maps folder…';
            break;
        case 'verifying':
            tr6StatusEl.textContent = 'Verifying files';
            tr6Section.classList.add('state-busy');
            tr6MessageEl.textContent = uiState.verifyInfo || 'Verifying installed files…';
            break;
        case 'error':
            tr6StatusEl.textContent = 'Error';
            tr6Section.classList.add('state-error');
            tr6MessageEl.textContent = uiState.message || 'Something went wrong.';
            tr6PrimaryBtn.textContent = 'Retry';
            tr6PrimaryBtn.dataset.action = 'download';
            tr6PrimaryBtn.classList.remove('hidden');
            break;
        default:
            tr6StatusEl.textContent = uiState.state || '';
            tr6MessageEl.textContent = '';
    }
}

function statusToUiState(status) {
    if (!status) return { state: 'unknown' };
    return {
        state: status.state,
        manifest: status.manifest,
        corrupted: status.corrupted,
        missing: status.missing,
        installedVersion: status.installedVersion,
        message: status.message
    };
}

function updateTr6ContentVisibility() {
    const game = gameSelect.value;
    const shouldShow = game === 'trr-6' && multiplayerCheckbox.checked;
    tr6Section.classList.toggle('hidden', !shouldShow);
    if (shouldShow) renderTr6ContentCard(tr6Content);
}

async function refreshTr6Content() {
    if (tr6ContentRefreshing) return;
    tr6ContentRefreshing = true;
    tr6Content = { state: 'checking' };
    updateTr6ContentVisibility();
    try {
        const status = await window.api.getTr6ContentStatus();
        tr6Content = statusToUiState(status);
    } catch (err) {
        tr6Content = { state: 'error', message: err.message };
    } finally {
        tr6ContentRefreshing = false;
        updateTr6ContentVisibility();
    }
}

tr6PrimaryBtn.addEventListener('click', async () => {
    if (tr6PrimaryBtn.dataset.action !== 'download') return;
    tr6Content = { state: 'downloading', progressPct: 0, progressInfo: 'Starting…' };
    updateTr6ContentVisibility();
    try {
        await window.api.downloadTr6Content();
    } catch (err) {
        tr6Content = { state: 'error', message: err.message };
        updateTr6ContentVisibility();
    }
});

tr6CancelBtn.addEventListener('click', async () => {
    try { await window.api.cancelTr6Download(); } catch (err) { }
});

tr6RevalidateBtn.addEventListener('click', () => { refreshTr6Content(); });

tr6OpenFolderBtn.addEventListener('click', () => {
    window.api.openTr6MapsFolder();
});

window.api.on('tr6ContentProgress', (payload) => {
    if (!payload) return;
    if (payload.phase === 'downloading') {
        const pct = payload.bytesTotal
            ? (payload.bytesDone / payload.bytesTotal) * 100
            : 0;
        tr6Content = {
            state: 'downloading',
            progressPct: pct,
            progressInfo: formatBytes(payload.bytesDone) + ' / ' + formatBytes(payload.bytesTotal)
        };
    } else if (payload.phase === 'verifying-archive') {
        tr6Content = { state: 'verifying-archive' };
    } else if (payload.phase === 'extracting') {
        tr6Content = { state: 'extracting' };
    } else if (payload.phase === 'verifying') {
        tr6Content = {
            state: 'verifying',
            verifyInfo: payload.currentFile
                ? 'Verifying ' + payload.currentFile + ' (' + (payload.fileIndex + 1) + '/' + payload.totalFiles + ')'
                : 'Verifying…'
        };
    }
    updateTr6ContentVisibility();
});

window.api.on('tr6ContentDownloadComplete', (status) => {
    tr6Content = statusToUiState(status);
    updateTr6ContentVisibility();
});

window.api.on('tr6ContentDownloadError', (err) => {
    if (err && err.aborted) {
        refreshTr6Content();
    } else {
        tr6Content = { state: 'error', message: (err && err.message) || 'Download failed' };
        updateTr6ContentVisibility();
    }
});

const serverSelect = document.getElementById("serverSelect");
const customServerOptions = document.getElementById("customServerOptions");
serverSelect.addEventListener("change", () => {
    if (serverSelect.value === "custom") {
        customServerOptions.classList.remove("hidden");
    } else {
        customServerOptions.classList.add("hidden");
    }
});

const privateSessionCheckbox = document.getElementById("privateSession");
const lobbyCodeOptions = document.getElementById("lobbyCodeOptions");
const lobbyCodeInput = document.getElementById("lobbyCode");
privateSessionCheckbox.addEventListener("change", () => {
    if (privateSessionCheckbox.checked) {
        lobbyCodeOptions.classList.remove("hidden");
    } else {
        lobbyCodeOptions.classList.add("hidden");
        lobbyCodeInput.value = "";
    }
    enableSaveButton();
});

selectExeButton.addEventListener("click", async () => {
    const filePath = await window.api.selectExeFile();
    if (filePath) {
        customExePath = filePath;
        selectExeButton.classList.add("active");
        selectExeButton.title = `Custom executable: ${filePath}`;
    }
});

stopModsButton.addEventListener("click", () => {
    launchButton.innerText = "Stopping...";
    launchButton.setAttribute("disabled", "true");
    stopModsButton.setAttribute("disabled", "true");
    window.api.stopMods();
});

launchButton.addEventListener("click", () => {
    document.querySelectorAll("input").forEach(e => e.classList.remove("errored"));

    let options = {
        game: gameSelect.value,
        manualPatch: patchSection.classList.contains("hidden") ? null : patchSelect.value,
        multiplayer: multiplayerCheckbox.checked,
        name: document.getElementById("displayName").value,
        privateSession: document.getElementById("privateSession").checked,
        lobbyCode: document.getElementById("lobbyCode").value.toLowerCase(),
        hideLobbyCode: document.getElementById("hideLobbyCode").checked,
        enableChat: document.getElementById("enableChat").checked,
        customServer: serverSelect.value === "custom",
        serverIp: document.getElementById("serverIp").value,
        serverPort: document.getElementById("serverPort").value,
        customExePath: customExePath,
        activeTab: activeTab,
    };

    const { features } = window.api.featureManifests;
    features.forEach(feature => {
        const checkbox = document.getElementById(feature.id);
        if (checkbox) {
            options[feature.id] = checkbox.checked;
        }
        if (feature.ui.altOptions) {
            feature.ui.altOptions.forEach(altOption => {
                const altCheckbox = document.getElementById(altOption.id);
                if (altCheckbox) {
                    options[altOption.id] = altCheckbox.checked;
                }
            });
        }
    });

    window.api[alreadyInjected ? "updateGame" : "launchGame"]({ ...options });

    alreadyInjected = true;
    isLaunching = true;
    launchButton.setAttribute("disabled", "true");
    launchButton.innerText = customExePath ? "Launching Game..." : "Waiting for Game...";

    selectExeButton.classList.add("hidden");
    document.querySelectorAll("input, select").forEach(input => input.setAttribute("disabled", "true"));
});

document.querySelectorAll("input, select").forEach(inp => {
    inp.addEventListener("change", enableSaveButton);
    inp.addEventListener("input", enableSaveButton);
});

generateTabUI();
updateTr6ContentVisibility();

const gameToggle = document.getElementById("gameToggle");
gameToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-toggle-btn");
    if (!btn || btn.classList.contains("active")) return;

    gameToggle.querySelectorAll(".game-toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gameSelect.value = btn.dataset.game;
    gameSelect.dispatchEvent(new Event("change"));
});

gameSelect.addEventListener("change", () => {
    gameToggle.querySelectorAll(".game-toggle-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.game === gameSelect.value);
    });
    generateTabUI();
    if (gameSelect.value === 'trr-6' && multiplayerCheckbox.checked) {
        refreshTr6Content();
    } else {
        updateTr6ContentVisibility();
    }
});

window.api.on("modInjecting", (data) => {
    isLaunching = true;
    launchButton.setAttribute("disabled", "true");
    launchButton.innerText = data.customExePath ? "Launching Game..." : "Waiting for Game...";
    selectExeButton.classList.add("hidden");
});

window.api.on("launcherOptions", (options) => {
    options = Object.fromEntries(
        Object.entries(options).map(([key, value]) => [
            key,
            value === "true" ? true : value === "false" ? false : value
        ])
    );

    document.getElementById("multiplayer").checked = options.multiplayer;
    document.getElementById("displayName").value = options.name || "";
    document.getElementById("lobbyCode").value = options.lobbyCode || "";
    document.getElementById("hideLobbyCode").checked = options.hideLobbyCode || false;
    const hasLobbyCode = options.lobbyCode && options.lobbyCode.length > 0;
    document.getElementById("privateSession").checked = hasLobbyCode;
    if (hasLobbyCode) {
        document.getElementById("lobbyCodeOptions").classList.remove("hidden");
    }
    document.getElementById("enableChat").checked = options.enableChat !== false;
    serverSelect.value = "community";
    document.getElementById("serverIp").value = options.serverIp || "";
    document.getElementById("serverPort").value = options.serverPort || "";
    gameSelect.value = options.game;
    gameSelect.dispatchEvent(new Event("change", { bubbles: true }));
    serverSelect.dispatchEvent(new Event("change"));

    const { features } = window.api.featureManifests;
    features.forEach(feature => {
        const checkbox = document.getElementById(feature.id);
        if (checkbox) {
            checkbox.checked = options[feature.id] || false;
        }
        if (feature.ui.altOptions) {
            feature.ui.altOptions.forEach(altOption => {
                const altCheckbox = document.getElementById(altOption.id);
                if (altCheckbox) {
                    altCheckbox.checked = options[altOption.id] || false;
                }
            });
        }
    });

    updateTabCounts();
    document.getElementById("multiplayer").dispatchEvent(new Event("change"));

    if (options.activeTab && document.querySelector(`.sidebar-item[data-tab="${options.activeTab}"]`)) {
        activeTab = options.activeTab;
        switchTab(activeTab);
    }
});

window.api.on("modStopping", () => {
    launchButton.innerText = "Stopping...";
    launchButton.setAttribute("disabled", "true");
    stopModsButton.setAttribute("disabled", "true");
});

window.api.on("modInjected", (options) => {
    isLaunching = false;
    alreadyInjected = true;
    launchButton.innerHTML = options.multiplayer ? "Connecting to server..." : "<svg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 50 50' width='50px' height='50px'>    <path d='M43.171,10.925L24.085,33.446l-9.667-9.015l1.363-1.463l8.134,7.585L41.861,9.378C37.657,4.844,31.656,2,25,2 C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23C48,19.701,46.194,14.818,43.171,10.925z'/></svg> Attached to game";

    stopModsButton.classList.remove("hidden");
    selectExeButton.classList.add("hidden");

    document.querySelectorAll(".tab-panel input").forEach(input => input.removeAttribute("disabled"));
    document.getElementById("privateSession").removeAttribute("disabled");
    document.getElementById("lobbyCode").removeAttribute("disabled");
    document.getElementById("hideLobbyCode").removeAttribute("disabled");
    document.getElementById("enableChat").removeAttribute("disabled");

    gameSelect.setAttribute("disabled", "true");
    gameToggle.classList.add("disabled");
    multiplayerCheckbox.setAttribute("disabled", "true");
    multiplayerCheckbox.parentNode.setAttribute("disabled", "true");
    displayNameInput.setAttribute("disabled", "true");
    serverSelect.setAttribute("disabled", "true");
    document.getElementById("serverIp").setAttribute("disabled", "true");
    document.getElementById("serverPort").setAttribute("disabled", "true");
    patchSection.classList.add("hidden");
});

window.api.on("serverConnected", (options, playerId) => {
    launchButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 50 50' width='50px' height='50px'>    <path d='M43.171,10.925L24.085,33.446l-9.667-9.015l1.363-1.463l8.134,7.585L41.861,9.378C37.657,4.844,31.656,2,25,2 C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23C48,19.701,46.194,14.818,43.171,10.925z'/></svg> Attached to game";
});

window.api.on("connectionFailed", () => {
    console.error("Connection failed");
    window.api.errorBox("Connection Failed", "Failed to connect to multiplayer server. The server may be offline or unreachable.");
    launchButton.innerText = "Launch Mods";
    launchButton.removeAttribute("disabled");
    stopModsButton.classList.add("hidden");
    alreadyInjected = false;
    isLaunching = false;
    document.querySelectorAll("input, select").forEach(input => input.removeAttribute("disabled"));
    multiplayerCheckbox.parentNode.removeAttribute("disabled");
    gameToggle.classList.remove("disabled");
});

window.api.on("versionOutdated", () => {
    console.error("Version outdated");
    window.api.errorBox("Version mismatch", "A new version is available. To play Multiplayer, please download the updated launcher at https://www.laracrofts.com");
    launchButton.innerText = "Launch Mods";
    launchButton.removeAttribute("disabled");
    stopModsButton.classList.add("hidden");
    alreadyInjected = false;
    isLaunching = false;
    document.querySelectorAll("input, select").forEach(input => input.removeAttribute("disabled"));
    multiplayerCheckbox.parentNode.removeAttribute("disabled");
    gameToggle.classList.remove("disabled");
});

window.api.on("requiredInputFailed", (failedInputs) => {
    const wasInjected = stopModsButton && !stopModsButton.classList.contains("hidden");
    if (!wasInjected) {
        alreadyInjected = false;
    }
    launchButton.innerText = alreadyInjected ? "Re-launch Mods" : "Launch Mods";
    launchButton.removeAttribute("disabled");
    isLaunching = false;

    if (!alreadyInjected) {
        stopModsButton.classList.add("hidden");
        selectExeButton.classList.remove("hidden");
        gameToggle.classList.remove("disabled");
        multiplayerCheckbox.parentNode.removeAttribute("disabled");
        gameSelect.removeAttribute("disabled");
    }

    document.querySelectorAll(".tab-panel input, .tab-panel select").forEach(input => input.removeAttribute("disabled"));

    if ("name" in failedInputs) {
        displayNameInput.classList.add("errored");
    }
    if ("lobbyCode" in failedInputs) {
        lobbyCodeInput.classList.add("errored");
    }
    if ("tr6Content" in failedInputs) {
        tr6Content = statusToUiState(failedInputs.tr6Content);
        updateTr6ContentVisibility();
        tr6Section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

window.api.on("patchDetectionFailed", (patches) => {
    launchButton.innerText = "Launch Mods";
    launchButton.removeAttribute("disabled");
    stopModsButton.classList.add("hidden");
    alreadyInjected = false;
    isLaunching = false;
    selectExeButton.classList.remove("hidden");

    document.querySelectorAll("input, select").forEach(input => input.removeAttribute("disabled"));
    multiplayerCheckbox.parentNode.removeAttribute("disabled");

    patchSelect.innerHTML = "";
    Object.entries(patches).forEach(([key, patch]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = patch.name;
        patchSelect.appendChild(option);
    });
    patchSection.classList.remove("hidden");
    patchSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.api.on("modStopped", () => {
    alreadyInjected = false;
    isLaunching = false;
    launchButton.innerText = "Launch Mods";
    launchButton.removeAttribute("disabled");
    stopModsButton.removeAttribute("disabled");
    stopModsButton.classList.add("hidden");
    selectExeButton.classList.remove("hidden");

    gameToggle.classList.remove("disabled");

    document.querySelectorAll("input, select").forEach(input => input.removeAttribute("disabled"));
    multiplayerCheckbox.parentNode.removeAttribute("disabled");
    patchSection.classList.add("hidden");
});

window.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[target='_blank']");
        if (link && link.href) {
            e.preventDefault();
            window.api.openExternal(link.href);
        }
    });

    const launcherBody = document.querySelector(".launcher-body");
    const content = document.querySelector(".content");
    if (launcherBody && content) {
        let scrollVelocity = 0;
        let animating = false;

        const smoothScroll = () => {
            if (Math.abs(scrollVelocity) < 0.5) {
                animating = false;
                return;
            }
            content.scrollTop += scrollVelocity;
            scrollVelocity *= 0.85;
            requestAnimationFrame(smoothScroll);
        };

        launcherBody.addEventListener("wheel", (e) => {
            if (!content.contains(e.target)) {
                scrollVelocity += e.deltaY * 0.3;
                if (!animating) {
                    animating = true;
                    requestAnimationFrame(smoothScroll);
                }
            }
        }, { passive: true });
    }
});
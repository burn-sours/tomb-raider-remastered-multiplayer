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

    window.api[alreadyInjected ? "updateGame" : "launchGame"]({...options});

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
    gameSelect.dispatchEvent(new Event("change", {bubbles: true}));
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

    if (options.activeTab) {
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
let alreadyInjected = false;
let isLaunching = false;
let customExePath = null;

const enableSaveButton = () => {
    if (isLaunching) return;
    const launchButton = document.getElementById('launchGameButton');
    launchButton.removeAttribute('disabled');
    if (alreadyInjected) {
        launchButton.innerText = 'Re-launch Mods';
    }
};

function generateFeatureUI() {
    const container = document.getElementById('featureOptions');
    const gameSelect = document.getElementById('gameSelect');
    const currentGame = gameSelect.value;

    container.innerHTML = '';

    const { features, categories } = window.api.featureManifests;

    categories.forEach(category => {
        const categoryFeatures = features.filter(f => {
            if (f.category !== category.id) return false;
            return f.supportedGames.includes(currentGame);
        });

        if (categoryFeatures.length === 0) return;

        const heading = document.createElement('h3');
        heading.className = 'subtitle';
        heading.textContent = category.name;
        container.appendChild(heading);

        categoryFeatures.forEach(feature => {
            const label = document.createElement('label');
            label.className = 'custom-checkbox';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = feature.id;

            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            label.appendChild(checkbox);
            label.appendChild(checkmark);
            label.appendChild(document.createTextNode(feature.ui.label));

            container.appendChild(label);

            checkbox.addEventListener('change', enableSaveButton);
            checkbox.addEventListener('input', enableSaveButton);

            if (feature.ui.altOptions && feature.ui.altOptions.length > 0) {
                const altContainer = document.createElement('div');
                altContainer.id = `${feature.id}-alt-options`;
                altContainer.className = 'conditional options hidden';
                altContainer.style.marginLeft = '20px';

                feature.ui.altOptions.forEach(altOption => {
                    const altLabel = document.createElement('label');
                    altLabel.className = 'custom-checkbox';

                    const altCheckbox = document.createElement('input');
                    altCheckbox.type = 'checkbox';
                    altCheckbox.id = altOption.id;

                    const altCheckmark = document.createElement('span');
                    altCheckmark.className = 'checkmark';

                    altLabel.appendChild(altCheckbox);
                    altLabel.appendChild(altCheckmark);
                    altLabel.appendChild(document.createTextNode(altOption.label));

                    altContainer.appendChild(altLabel);

                    altCheckbox.addEventListener('change', enableSaveButton);
                    altCheckbox.addEventListener('input', enableSaveButton);
                });

                container.appendChild(altContainer);

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        altContainer.classList.add('hidden');
                    } else {
                        altContainer.classList.remove('hidden');
                    }
                });

                if (checkbox.checked) {
                    altContainer.classList.add('hidden');
                } else {
                    altContainer.classList.remove('hidden');
                }
            }
        });
    });
}

const multiplayerCheckbox = document.getElementById('multiplayer');
const launchButton = document.getElementById('launchGameButton');
const stopModsButton = document.getElementById('stopModsButton');
const selectExeButton = document.getElementById('selectExeButton');
const gameSelect = document.getElementById('gameSelect');
const patchSection = document.getElementById('patchSection');
const patchSelect = document.getElementById('patchSelect');
const displayNameInput = document.getElementById('displayName');
const mpOptions = document.getElementById('mpOptions');

multiplayerCheckbox.addEventListener('change', () => {
    if (multiplayerCheckbox.checked) {
        mpOptions.classList.remove('hidden');
    } else {
        mpOptions.classList.add('hidden');
    }
});

const serverSelect = document.getElementById('serverSelect');
const customServerOptions = document.getElementById('customServerOptions');
serverSelect.addEventListener('change', () => {
    if (serverSelect.value === 'custom') {
        customServerOptions.classList.remove('hidden');
    } else {
        customServerOptions.classList.add('hidden');
    }
});

selectExeButton.addEventListener('click', async () => {
    const filePath = await window.api.selectExeFile();
    if (filePath) {
        customExePath = filePath;
        selectExeButton.classList.add('active');
        selectExeButton.title = `Custom executable: ${filePath}`;
    }
});

stopModsButton.addEventListener('click', () => {
    launchButton.innerText = 'Stopping...';
    launchButton.setAttribute('disabled', true);
    stopModsButton.setAttribute('disabled', true);
    window.api.stopMods();
});

launchButton.addEventListener('click', () => {
    document.querySelectorAll('input').forEach(e => e.classList.remove('errored'));

    let options = {
        game: gameSelect.value,
        manualPatch: patchSection.classList.contains('hidden') ? null : patchSelect.value,
        multiplayer: multiplayerCheckbox.checked,
        name: document.getElementById('displayName').value,
        lobbyCode: document.getElementById('lobbyCode').value,
        hideLobbyCode: document.getElementById('hideLobbyCode').checked,
        customServer: serverSelect.value === 'custom',
        serverIp: document.getElementById('serverIp').value,
        serverPort: document.getElementById('serverPort').value,
        customExePath: customExePath,
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

    window.api[alreadyInjected ? 'updateGame' : 'launchGame']({...options});

    alreadyInjected = true;
    isLaunching = true;
    launchButton.setAttribute('disabled', true);
    launchButton.innerText = customExePath ? 'Launching Game...' : 'Waiting for Game...';

    selectExeButton.classList.add('hidden');

    // Disable all inputs during launch
    document.querySelectorAll('input, select').forEach(input => input.setAttribute('disabled', true));
});

// Listen for changes to launcher preferences
document.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', enableSaveButton);
    inp.addEventListener('input', enableSaveButton);
});
gameSelect.addEventListener('change', enableSaveButton);

// Generate initial layout
generateFeatureUI();
gameSelect.addEventListener('change', generateFeatureUI);

// Listen to api events
window.api.onLauncherOptions((options) => {
    options = Object.fromEntries(
        Object.entries(options).map(([key, value]) => [
            key,
            value === "true" ? true : value === "false" ? false : value
        ])
    );

    // Restore basic options
    document.getElementById('multiplayer').checked = options.multiplayer;
    document.getElementById('displayName').value = options.name || "";
    document.getElementById('lobbyCode').value = options.lobbyCode || "";
    document.getElementById('hideLobbyCode').checked = options.hideLobbyCode || false;
    serverSelect.value = 'community';
    document.getElementById('serverIp').value = options.serverIp || "";
    document.getElementById('serverPort').value = options.serverPort || "";
    gameSelect.value = options.game;
    gameSelect.dispatchEvent(new Event('change', {bubbles: true}));
    serverSelect.dispatchEvent(new Event('change'));

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

    document.getElementById('multiplayer').dispatchEvent(new Event('change'));
});

window.api.onModAttached((options) => {
    isLaunching = false;
    launchButton.innerHTML = options.multiplayer ? 'Connecting to server...' : '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M43.171,10.925L24.085,33.446l-9.667-9.015l1.363-1.463l8.134,7.585L41.861,9.378C37.657,4.844,31.656,2,25,2 C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23C48,19.701,46.194,14.818,43.171,10.925z"/></svg> Attached to game';

    stopModsButton.classList.remove('hidden');

    // Re-enable feature checkboxes
    document.querySelectorAll('#featureOptions input').forEach(input => input.removeAttribute('disabled'));

    // Re-enable lobby code fields (can be changed while playing)
    document.getElementById('lobbyCode').removeAttribute('disabled');
    document.getElementById('hideLobbyCode').removeAttribute('disabled');

    // These fields remain disabled after game attachment (can't change game type or server mid-session)
    gameSelect.setAttribute('disabled', true);
    multiplayerCheckbox.setAttribute('disabled', true);
    multiplayerCheckbox.parentNode.setAttribute('disabled', true);
    displayNameInput.setAttribute('disabled', true);
    serverSelect.setAttribute('disabled', true);
    document.getElementById('serverIp').setAttribute('disabled', true);
    document.getElementById('serverPort').setAttribute('disabled', true);

    // Hide patch selection after successful injection
    patchSection.classList.add('hidden');
});

window.api.onServerConnected((options, playerId) => {
    launchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M43.171,10.925L24.085,33.446l-9.667-9.015l1.363-1.463l8.134,7.585L41.861,9.378C37.657,4.844,31.656,2,25,2 C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23C48,19.701,46.194,14.818,43.171,10.925z"/></svg> Attached to game';
});

window.api.onConnectionFailed(() => {
    console.error('Connection failed');
    window.api.errorBox('Connection Failed', 'Failed to connect to multiplayer server. The server may be offline or unreachable.');
    launchButton.innerText = 'Launch Mods';
    launchButton.removeAttribute('disabled');
    stopModsButton.classList.add('hidden');
    alreadyInjected = false;
    isLaunching = false;
    document.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
    multiplayerCheckbox.parentNode.removeAttribute('disabled');
});

window.api.onVersionOutdated(() => {
    console.error('Version outdated');
    window.api.errorBox('Version mismatch', 'A new version is available. To play Multiplayer, please download the updated launcher at https://www.laracrofts.com');
    launchButton.innerText = 'Launch Mods';
    launchButton.removeAttribute('disabled');
    stopModsButton.classList.add('hidden');
    alreadyInjected = false;
    isLaunching = false;
    document.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
    multiplayerCheckbox.parentNode.removeAttribute('disabled');
});

window.api.onRequiredInputFailed((options, input) => {
    launchButton.innerText = 'Launch Mods';
    launchButton.removeAttribute('disabled');
    stopModsButton.classList.add('hidden');
    alreadyInjected = false;
    isLaunching = false;
    selectExeButton.classList.remove('hidden');

    document.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
    multiplayerCheckbox.parentNode.removeAttribute('disabled');

    if ('name' in input) {
        displayNameInput.classList.add('errored');
    }
});

window.api.onPatchDetectionFailed((patches) => {
    launchButton.innerText = 'Launch Mods';
    launchButton.removeAttribute('disabled');
    stopModsButton.classList.add('hidden');
    alreadyInjected = false;
    isLaunching = false;
    selectExeButton.classList.remove('hidden');

    document.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
    multiplayerCheckbox.parentNode.removeAttribute('disabled');

    patchSelect.innerHTML = '';
    Object.entries(patches).forEach(([key, patch]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = patch.name;
        patchSelect.appendChild(option);
    });
    patchSection.classList.remove('hidden');
    patchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

window.api.onModsStopped(() => {
    alreadyInjected = false;
    isLaunching = false;
    launchButton.innerText = 'Launch Mods';
    launchButton.removeAttribute('disabled');
    stopModsButton.removeAttribute('disabled');
    stopModsButton.classList.add('hidden');
    selectExeButton.classList.remove('hidden');

    document.querySelectorAll('input, select').forEach(input => input.removeAttribute('disabled'));
    multiplayerCheckbox.parentNode.removeAttribute('disabled');
    patchSection.classList.add('hidden');
});

window.addEventListener('DOMContentLoaded', () => {
    // Send all links to external browser
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[target="_blank"]');
        if (link && link.href) {
            e.preventDefault();
            window.api.openExternal(link.href);
        }
    });
});
let currentLevel = null;
let levels = [];
let levelNames = {};
let targetLevel = null;

const levelGrid = document.getElementById('levelGrid');
const restartButton = document.getElementById('restartButton');
const ngPlusLabel = document.getElementById('ngPlusLabel');
const ngPlusToggle = document.getElementById('ngPlusToggle');
const loopLevelLabel = document.getElementById('loopLevelLabel');
const loopLevelToggle = document.getElementById('loopLevelToggle');

function onLevelClick(levelId) {
    if (targetLevel !== null || levelId === currentLevel) return;

    targetLevel = levelId;
    window.api.callFeatureAction('level-select', 'changeLevel', { levelId });
}

restartButton.addEventListener('click', () => {
    window.api.callFeatureAction('level-select', 'restartLevel');
});

loopLevelToggle.addEventListener('change', () => {
    window.api.callFeatureAction('level-select', 'setLoopLevel', { enabled: loopLevelToggle.checked });

    const currentBtn = document.querySelector(`.level-button[data-level-id="${currentLevel}"]`);
    if (currentBtn) {
        const existingIcon = currentBtn.querySelector('.loop-icon');
        if (loopLevelToggle.checked && !existingIcon) {
            const loopIcon = document.createElement('span');
            loopIcon.className = 'loop-icon';
            loopIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
            currentBtn.appendChild(loopIcon);
        } else if (!loopLevelToggle.checked && existingIcon) {
            existingIcon.remove();
        }
    }
});

ngPlusToggle.addEventListener('change', () => {
    window.api.callFeatureAction('level-select', 'setNewGamePlus', { enabled: ngPlusToggle.checked });
});

function renderLevels(levelData) {
    levelGrid.innerHTML = '';
    levels = levelData;

    levels.forEach(level => {
        const button = document.createElement('button');
        button.className = 'level-button';
        button.dataset.levelId = level.id;

        const levelName = document.createElement('span');
        levelName.textContent = level.name;
        button.appendChild(levelName);

        if (level.id === currentLevel) {
            button.classList.add('current');
            if (loopLevelToggle.checked) {
                const loopIcon = document.createElement('span');
                loopIcon.className = 'loop-icon';
                loopIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
                button.appendChild(loopIcon);
            }
        }

        button.addEventListener('click', () => onLevelClick(level.id));
        levelGrid.appendChild(button);
    });

}

function updateCurrentLevel(levelId) {
    currentLevel = levelId;

    if (targetLevel !== null) {
        targetLevel = null;
    }

    document.querySelectorAll('.level-button').forEach(btn => {
        btn.classList.remove('current');
        const existingIcon = btn.querySelector('.loop-icon');
        if (existingIcon) {
            existingIcon.remove();
        }

        if (parseInt(btn.dataset.levelId) === levelId) {
            btn.classList.add('current');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            if (loopLevelToggle.checked) {
                const loopIcon = document.createElement('span');
                loopIcon.className = 'loop-icon';
                loopIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
                btn.appendChild(loopIcon);
            }
        }
    });
}

window.api.on('levelSelectData', (data) => {
    currentLevel = data.currentLevel;
    levels = data.levels;
    levelNames = data.levelNames;

    const isTrr45 = data.gameModule === 'tomb4.dll' || data.gameModule === 'tomb5.dll';
    if (isTrr45) {
        restartButton.classList.add('hidden');
        loopLevelLabel.classList.add('hidden');
    } else {
        restartButton.classList.remove('hidden');
        loopLevelLabel.classList.remove('hidden');
    }
    ngPlusLabel.classList.remove('hidden');

    renderLevels(levels);
    updateCurrentLevel(currentLevel);
});

window.api.on('levelChanged', (data) => {
    updateCurrentLevel(data.level);
});

window.api.on('actionFailed', () => {
    targetLevel = null;
});

window.api.on('modStopped', () => {
    currentLevel = null;
    levels = [];
    levelNames = {};
    targetLevel = null;

    levelGrid.innerHTML = '<div class="placeholder-content"><p>Launch the game to load available levels</p></div>';
    ngPlusLabel.classList.add('hidden');
    ngPlusToggle.checked = false;
    loopLevelLabel.classList.add('hidden');
    loopLevelToggle.checked = false;
    restartButton.classList.add('hidden');
});

// Send all links to external browser
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[target='_blank']");
    if (link && link.href) {
        e.preventDefault();
        window.api.openExternal(link.href);
    }
});
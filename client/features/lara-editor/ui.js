const inputs = {
    posX: document.getElementById('posX'),
    posY: document.getElementById('posY'),
    posZ: document.getElementById('posZ'),
    roomId: document.getElementById('roomId'),
    rotYaw: document.getElementById('rotYaw'),
    rotPitch: document.getElementById('rotPitch'),
    rotRoll: document.getElementById('rotRoll'),
    statHealth: document.getElementById('statHealth'),
    statOxygen: document.getElementById('statOxygen'),
    outfitId123: document.getElementById('outfitId123'),
    outfitId456: document.getElementById('outfitId456')
};

let focusedInput = null;

// Track which input is focused to prevent overwriting during editing
Object.values(inputs).forEach(input => {
    input.addEventListener('focus', () => {
        focusedInput = input;
    });
    input.addEventListener('blur', () => {
        focusedInput = null;
    });
});

function updateLaraValue(field, value) {
    const dataMap = {
        posX: 'x',
        posY: 'y',
        posZ: 'z',
        roomId: 'roomId',
        rotYaw: 'yaw',
        rotPitch: 'pitch',
        rotRoll: 'roll',
        statHealth: 'health',
        statOxygen: 'oxygen',
        outfitId123: 'outfitId',
        outfitId456: 'outfitId'
    };

    const data = {};
    data[dataMap[field]] = value;

    window.api.callFeatureAction('lara-editor', 'updateLara', data);
}

Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (input.type === 'checkbox') {
        input.addEventListener('change', () => {
            updateLaraValue(key, input.checked ? 1 : 0);
            input.blur();
        });
    } else if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
            updateLaraValue(key, input.value);
            input.blur();
        });
    } else {
        input.addEventListener('change', () => {
            updateLaraValue(key, input.value);
            input.blur();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
});

window.api.on('laraEditorData', (data) => {
    if (data.gameModule) {
        const isTrr45 = data.gameModule.includes('tomb4') || data.gameModule.includes('tomb5');
        inputs.outfitId123.style.display = !isTrr45 ? 'block' : 'none';
        inputs.outfitId456.style.display = !isTrr45 ? 'none' : 'block';
    }

    if (data.reset) {
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        return;
    }

    if (inputs.posX !== focusedInput) inputs.posX.value = data.x;
    if (inputs.posY !== focusedInput) inputs.posY.value = data.y;
    if (inputs.posZ !== focusedInput) inputs.posZ.value = data.z;
    if (inputs.roomId !== focusedInput) inputs.roomId.value = data.roomId;
    if (inputs.rotYaw !== focusedInput) inputs.rotYaw.value = data.yaw;
    if (inputs.rotPitch !== focusedInput) inputs.rotPitch.value = data.pitch;
    if (inputs.rotRoll !== focusedInput) inputs.rotRoll.value = data.roll;
    if (inputs.statHealth !== focusedInput) inputs.statHealth.value = data.health;
    if (inputs.statOxygen !== focusedInput) inputs.statOxygen.value = data.oxygen;

    if (inputs.outfitId123.style.display !== 'none') {
        if (inputs.outfitId123 !== focusedInput) inputs.outfitId123.value = data.outfitId;
    } else {
        if (inputs.outfitId456 !== focusedInput) inputs.outfitId456.value = data.outfitId;
    }
});

window.api.on('modStopped', () => {
    Object.values(inputs).forEach(input => input.value = '');
});

const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach((header, index) => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isCollapsed = content.classList.contains('collapsed');

        if (isCollapsed) {
            content.classList.remove('collapsed');
            header.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            header.classList.add('collapsed');
        }
    });

    if (index !== 0) {
        const content = header.nextElementSibling;
        content.classList.add('collapsed');
        header.classList.add('collapsed');
    }
});


document.addEventListener("click", (e) => {
    const link = e.target.closest("a[target='_blank']");
    if (link && link.href) {
        e.preventDefault();
        window.api.openExternal(link.href);
    }
});
const multiplayerOption = document.getElementById('multiplayer-option');
const contributorsToggle = document.getElementById('contributors-toggle');

document.addEventListener('DOMContentLoaded', () => {
    multiplayerOption.addEventListener('click', () => {
        window.api.openMultiplayerTool();
    });

    contributorsToggle.addEventListener('click', () => {
        const arrow = document.querySelector('.contributors-arrow');
        const list = document.getElementById('contributors-list');

        arrow.classList.toggle('expanded');
        list.classList.toggle('expanded');
    });

    // Send all links to external browser
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[target="_blank"]');
        if (link && link.href) {
            e.preventDefault();
            window.api.openExternal(link.href);
        }
    });
});
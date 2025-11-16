
module.exports = {
    features: [
        require("./super-jump/manifest"),
        require("./no-fall-damage/manifest"),
        require("./spider-lara/manifest"),
        require("./glitch-lara/manifest"),
        require("./super-speed/manifest"),
        require("./swim-fly/manifest"),
        require("./unlock-golden-pistols/manifest"),
        require("./perma-damage/manifest"),
        require("./perma-poison/manifest"),
        require("./infinite-oxygen/manifest"),
        require("./infinite-health/manifest"),
        require("./level-select/manifest"),
    ],
    categories: [
        {
            "id": "challenge",
            "name": "Challenge Modes"
        },
        {
            "id": "super-lara",
            "name": "Super Lara"
        },
        {
            "id": "unlocks",
            "name": "Unlocks"
        },
        {
            "id": "vitals",
            "name": "Health & Oxygen"
        },
        {
            "id": "game-speed",
            "name": "Game Speed"
        }
    ]
};
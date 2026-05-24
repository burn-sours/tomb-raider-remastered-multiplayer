
module.exports = {
    features: [
        require("./super-jump/manifest"),
        require("./no-fall-damage/manifest"),
        require("./spider-lara/manifest"),
        require("./glitch-lara/manifest"),
        require("./super-speed/manifest"),
        require("./swim-fly/manifest"),
        require("./perma-damage/manifest"),
        require("./perma-poison/manifest"),
        require("./infinite-oxygen/manifest"),
        require("./infinite-health/manifest"),
        require("./infinite-strength/manifest"),
    ],
    categories: [
        {
            "id": "challenge",
            "name": "Challenge Modes",
            "description": "Make the game harder with challenges."
        },
        {
            "id": "super-lara",
            "name": "Super Lara",
            "description": "Give Lara super abilities."
        },
        {
            "id": "vitals",
            "name": "Health & Oxygen",
            "description": "Modify Lara's vitals."
        },
        {
            "id": "game-speed",
            "name": "Game Speed",
            "description": "Adjust the game speed."
        },
    ]
};
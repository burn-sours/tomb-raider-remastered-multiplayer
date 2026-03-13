/**
 * Discord Bot for TRR Multiplayer Server - Player List Display
 *
 * SETUP:
 * 1. Copy this file to discord-bot.js
 * 2. Fill in DISCORD_BOT_TOKEN and DISCORD_CHANNEL_ID below
 * 3. Run: npm run init-discord (posts initial message, prints MESSAGE ID)
 * 4. Copy the MESSAGE ID printed and paste into DISCORD_MESSAGE_ID below
 * 5. Run in separate terminal: npm run start-discord
 *
 * DISCORD SETUP:
 * 1. Create a bot at https://discord.com/developers/applications
 * 2. Enable "Message Content Intent" in Bot settings
 * 3. Invite bot with permissions: Send Messages, Manage Channels (for rename)
 */

const fs = require('fs');
const path = require('path');

// ============ CREDENTIALS - FILL THESE IN ============
const DISCORD_BOT_TOKEN = 'your-bot-token-here';
const DISCORD_CHANNEL_ID = '123456789012345678';  // Channel for message + rename
const DISCORD_MESSAGE_ID = '123456789012345678';  // Message to edit (bot must have posted it)
// =====================================================

const STATS_FILE = path.join(__dirname, '..', 'player-stats.json');
const LOBBIES_STATS_FILE = path.join(__dirname, '..', 'player-stats-lobbies.json');
const POLL_INTERVAL_MS = 5000;        // Check stats every 5 seconds
const STALE_THRESHOLD_MS = 30000;     // Server offline if no update for 30 seconds
const CHANNEL_RENAME_INTERVAL_MS = 300000;  // Only rename channel every 5 minutes (Discord rate limit)

// Level name mappings for all 5 games
const LEVEL_NAMES = {
    // TR1: bundleId=0, version=0
    '0_0': {
        0: "Lara's Home",
        1: "Caves",
        2: "Vilcabamba",
        3: "Lost Valley",
        4: "Qualopec",
        5: "Francis Folly",
        6: "Colosseum",
        7: "Palace Midas",
        8: "The Cistern",
        9: "Tihocan",
        10: "City Khamoon",
        11: "Obelisk Khamoon",
        12: "Sanctuary",
        13: "Natla's Mines",
        14: "Atlantis",
        15: "Great Pyramid",
        16: "Return to Egypt",
        17: "Temple of Cat",
        18: "Stronghold",
        19: "The Hive",
        24: "Main Menu"
    },
    // TR2: bundleId=0, version=1
    '0_1': {
        0: "Lara's Home",
        1: "Great Wall",
        2: "Venice",
        3: "Bartoli's",
        4: "Opera House",
        5: "Offshore Rig",
        6: "Diving Area",
        7: "40 Fathoms",
        8: "Maria Doria",
        9: "Living Quarters",
        10: "The Deck",
        11: "Tibet",
        12: "Barkhang",
        13: "Talion",
        14: "Ice Palace",
        15: "Temple of Xian",
        16: "Floating Islands",
        17: "Dragon's Lair",
        18: "Home Sweet Home",
        19: "The Cold War",
        20: "Fool's Gold",
        21: "Furnace of Gods",
        22: "Kingdom",
        23: "Vegas",
        63: "Main Menu"
    },
    // TR3: bundleId=0, version=2
    '0_2': {
        0: "Lara's Home",
        1: "Jungle",
        2: "Temple Ruins",
        3: "River Ganges",
        4: "Caves of Kaliya",
        5: "Coastal Village",
        6: "Crash Site",
        7: "Madubu Gorge",
        8: "Temple of Puna",
        9: "Thames Wharf",
        10: "Aldwych",
        11: "Lud's Gate",
        12: "City",
        13: "Nevada Desert",
        14: "HSC",
        15: "Area 51",
        16: "Antarctica",
        17: "RX-Tech Mines",
        18: "Tinnos",
        19: "Meteorite Cavern",
        20: "All Hallows",
        21: "Highland Fling",
        22: "Willard's Lair",
        23: "Shakespeare Cliff",
        24: "Sleeping with Fishes",
        25: "It's a Madhouse!",
        26: "Reunion",
        63: "Main Menu"
    },
    // TR4: bundleId=1, version=0
    '1_0': {
        0: "Main Menu",
        1: "Angkor Wat",
        2: "Race for Iris",
        3: "The Tomb of Seth",
        4: "Burial Chambers",
        5: "Valley of Kings",
        6: "KV5",
        7: "Temple of Karnak",
        8: "Great Hypostyle",
        9: "Sacred Lake",
        11: "Tomb of Semerkhet",
        12: "Guardian of Semerkhet",
        13: "Desert Railroad",
        14: "Alexandria",
        15: "Coastal Ruins",
        16: "Pharos",
        17: "Cleopatra's",
        18: "Catacombs",
        19: "Poseidon",
        20: "The Lost Library",
        21: "Demetrius",
        22: "City of Dead",
        23: "Trenches",
        24: "Chambers of Tulun",
        25: "Street Bazaar",
        26: "Citadel Gate",
        27: "Citadel",
        28: "Sphinx Complex",
        30: "Underneath Sphinx",
        31: "Menkaure's Pyramid",
        32: "Inside Menkaure's",
        33: "The Mastabas",
        34: "Great Pyramid",
        35: "Khufu's Queens",
        36: "Inside Great Pyramid",
        37: "Temple of Horus",
        38: "Temple of Horus",
        40: "The Times Exclusive"
    },
    // TR5: bundleId=1, version=1
    '1_1': {
        0: "Main Menu",
        1: "Rome",
        2: "Trajan's Markets",
        3: "Colosseum",
        4: "The Base",
        5: "Submarine",
        6: "Deepsea Dive",
        7: "Sinking Submarine",
        8: "Gallows Tree",
        9: "Labyrinth",
        10: "Old Mill",
        11: "The 13th Floor",
        12: "Escape with Iris",
        13: "Security Breach",
        14: "Red Alert!"
    }
};

const GAME_NAMES = {
    '0_0': 'Tomb Raider 1',
    '0_1': 'Tomb Raider 2',
    '0_2': 'Tomb Raider 3',
    '1_0': 'Tomb Raider 4',
    '1_1': 'Tomb Raider 5'
};

let client;
let lastChannelRename = 0;
let lastMessageContent = null;
let lastChannelName = null;

const INIT_MODE = process.argv.includes('--init');

async function main() {
    const { Client, GatewayIntentBits } = require('discord.js');

    client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
    });

    client.once('clientReady', async () => {
        console.log(`Discord bot logged in as ${client.user.tag}`);

        if (INIT_MODE) {
            await postInitialMessage();
        } else {
            startPolling();
        }
    });

    client.login(DISCORD_BOT_TOKEN);
}

async function postInitialMessage() {
    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        const message = await channel.send('# Players online\n\n**Initializing...**');
        console.log('\n========================================');
        console.log('Initial message posted!');
        console.log(`MESSAGE ID: ${message.id}`);
        console.log('========================================');
        console.log('\nCopy the MESSAGE ID above and paste it into');
        console.log('DISCORD_MESSAGE_ID in your discord-bot.js file.');
        console.log('\nThen run the bot normally without --init');
        process.exit(0);
    } catch (e) {
        console.error('Failed to post initial message:', e.message);
        process.exit(1);
    }
}

function startPolling() {
    setInterval(async () => {
        try {
            const stats = await readStatsFile(STATS_FILE);
            const lobbyStats = await readStatsFile(LOBBIES_STATS_FILE);
            if (!stats || Date.now() - stats.timestamp > STALE_THRESHOLD_MS) {
                await showOffline();
            } else {
                await updatePlayerList(stats, lobbyStats);
            }
        } catch (e) {
            console.error('Poll error:', e.message);
            await showOffline();
        }
    }, POLL_INTERVAL_MS);
}

async function readStatsFile(filePath) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 100;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            if (attempt < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }
    return null;
}

async function showOffline() {
    const message = '# Players online\n\n**Server is currently offline**';
    await updateDiscordMessage(message);
    await renameChannel('🔴-server-offline');
}

async function updatePlayerList(stats, lobbyStats) {
    const message = formatPlayerMessage(stats, lobbyStats);
    const totalAll = stats.totalPlayers + (lobbyStats?.totalPlayers || 0);
    await updateDiscordMessage(message);
    await renameChannel(`🟢-${totalAll}-players-online`);
}

function formatPlayerMessage(stats, lobbyStats) {
    const privateCount = lobbyStats?.totalPlayers || 0;
    const totalAll = stats.totalPlayers + privateCount;

    if (totalAll === 0) {
        return '# Players online\n\n**No players currently online**';
    }

    let message = '# Players online\n';

    // Show private lobby count first if any
    if (privateCount > 0) {
        message += `\n## :lock: Private Lobbies - \`${privateCount} online\`\n`;
    }

    if (stats.totalPlayers === 0) {
        return message;
    }

    // Group players by game
    const gameGroups = {};
    for (const player of stats.players) {
        const gameKey = `${player.bundleId}_${player.version}`;
        if (!gameGroups[gameKey]) {
            gameGroups[gameKey] = {};
        }
        const levelName = LEVEL_NAMES[gameKey]?.[player.level] || `Level ${player.level}`;
        if (!gameGroups[gameKey][levelName]) {
            gameGroups[gameKey][levelName] = 0;
        }
        gameGroups[gameKey][levelName]++;
    }

    // Sort games by their key (TR1, TR2, TR3, TR4, TR5)
    const sortedGames = Object.keys(gameGroups).sort();

    for (const gameKey of sortedGames) {
        const gameName = GAME_NAMES[gameKey] || `Unknown Game (${gameKey})`;
        const levels = gameGroups[gameKey];
        const gameTotal = Object.values(levels).reduce((sum, count) => sum + count, 0);

        message += `\n## :skull: ${gameName} - \`${gameTotal} online\`\n`;
        message += formatAsciiTable(levels);
    }

    return message;
}

function formatAsciiTable(levels) {
    const entries = Object.entries(levels).filter(([_, count]) => count > 0);
    if (entries.length === 0) return '';

    // Find max level name length for padding
    const maxNameLen = Math.max(...entries.map(([name]) => name.length), 10);
    const maxCountLen = Math.max(...entries.map(([_, count]) => String(count + " online").length), 2);

    let table = '```';
    table += `╔${'═'.repeat(maxNameLen + 2)}╦${'═'.repeat(maxCountLen + 2)}╗\n`;

    entries.forEach(([name, count], index) => {
        const paddedName = name.padEnd(maxNameLen);
        const paddedCount = String(count + " online").padStart(maxCountLen);
        table += `║ ${paddedName} ║ ${paddedCount} ║\n`;

        if (index < entries.length - 1) {
            table += `╠${'═'.repeat(maxNameLen + 2)}╬${'═'.repeat(maxCountLen + 2)}╣\n`;
        }
    });

    table += `╚${'═'.repeat(maxNameLen + 2)}╩${'═'.repeat(maxCountLen + 2)}╝`;
    table += '```';

    return table;
}

async function updateDiscordMessage(content) {
    // Skip if content hasn't changed
    if (content === lastMessageContent) {
        return;
    }

    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        const message = await channel.messages.fetch(DISCORD_MESSAGE_ID);
        await message.edit(content);
        lastMessageContent = content;
    } catch (e) {
        console.error('Failed to update Discord message:', e.message);
    }
}

async function renameChannel(name) {
    // Skip if name hasn't changed
    if (name === lastChannelName) {
        return;
    }

    // Rate limit: only rename every 5 minutes
    const now = Date.now();
    if (now - lastChannelRename < CHANNEL_RENAME_INTERVAL_MS) {
        return;
    }

    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        await channel.setName(name);
        lastChannelName = name;
        lastChannelRename = now;
    } catch (e) {
        console.error('Failed to rename channel:', e.message);
    }
}

main();

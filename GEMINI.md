# Project: Burn's Mods & Multiplayer for Tomb Raider Remastered

## Overview
This project is an open-source multiplayer launcher and modding platform for **Tomb Raider Remastered (I-V)**. It enables real-time multiplayer interaction (co-op/PVP), in-game chat, and various gameplay modifiers (e.g., Super Jump, Infinite Health) without permanently modifying game files.

The core technology relies on **Frida** for runtime memory instrumentation/injection, **Electron** for the client UI, and a **Node.js** UDP server for handling multiplayer traffic.

## Architecture

### Client (`client/`)
The client is an Electron application that acts as the launcher and mod manager.
- **`baseClient.js`**: The core class managing the Frida session, game process attachment, and network synchronization loops (frame/tick/update loops).
- **`index.js`**: Entry point for the Electron main process.
- **`ui/`**: Frontend assets (HTML/CSS/JS) for the launcher interface.
- **`features/`**: Modular gameplay mods. Each feature (e.g., `super-jump`, `infinite-health`) has a `manifest.json` and `game.js` containing the specific memory hooks and logic.
- **`games/`**: Game-specific configurations and memory addresses for supported titles (`trr-123`, `trr-45`).
- **`frida_binding.node`**: Pre-compiled Frida binding for interacting with the game process.

### Server (`server/`)
A standalone Node.js UDP server that acts as a non-authoritative relay for multiplayer data.
- **`server.js` / `index.js`**: Main server logic handling connections, packet relaying, and basic validation.
- **`netcode.js` (Shared)**: Handles packet encoding/decoding/compression (Zstandard) to ensure efficient data transmission.

### Shared (`shared/`)
Contains code shared between client and server, primarily networking utilities and packet definitions in `netcode.js`.

## Key Technologies
- **Runtime:** Node.js
- **UI Framework:** Electron
- **Memory Instrumentation:** Frida
- **Networking:** UDP with Zstandard compression (`zstd-codec`)
- **Build Tools:** `electron-builder` (Client), `pkg` (Server)

## Build & Run Commands

### Prerequisites
- Node.js (v18+ recommended)
- Python (for some build dependencies)
- Windows (primary target for game interaction), though some components build on Linux.

### Scripts
| Command | Description |
| :--- | :--- |
| `npm install` | Install dependencies. |
| `npm run start-client` | Launch the Electron client in development mode. |
| `npm run start-server` | Start the multiplayer server locally. |
| `npm run deploy` | Build production executables for both client and server. Output is in `releases/`. |

## Development Conventions

### Mod/Feature Architecture
- **Plugin-based:** New gameplay features should be added as directories in `client/features/`.
- **Manifests:** Each feature requires a `manifest.json` defining its ID, name, and supported games.
- **Injection:** Logic is injected via `game.js` in the feature directory using Frida hooks.
- **Non-Invasive:** **NEVER** modify game files on disk. All changes must be done in memory via Frida.

### Networking
- **Protocol:** Custom binary protocol over UDP.
- **State:** The server is non-authoritative; clients send their state (position, anims) which is relayed to others.
- **Efficiency:** High-frequency data (player positions) is separated from reliable events (chat, connections).

### Code Style
- **Module Boundaries:** Keep game logic, networking, and UI separate.
- **Error Handling:** Robust handling for network timeouts, game process crashes, and version mismatches.
- **Async/Await:** heavily used for Frida operations and network IO.
- **Formatting:** Follow standard JavaScript/Node.js conventions found in existing files.

### Contribution Guidelines
- Ensure code is self-documenting.

# Burn's Mods & Multiplayer for Tomb Raider Remastered

> **Experience Classic Tomb Raider Like Never Before**

This is a free, open-source launcher that brings **multiplayer** and **customizable mods** to Tomb Raider Remastered (I-V). See other players exploring in real-time, battle in PVP combat, chat in-game, and enhance your gameplay with mods — from super jump to hardcore permadeath mode.

**🎮 Supported Games:**
- Tomb Raider I, II, III (Remastered)
- Tomb Raider IV: The Last Revelation (Remastered)
- Tomb Raider V: Chronicles (Remastered)

---

## Features

### 🌐 Multiplayer

**Play Tomb Raider Remastered with friends for the first time ever!**

- **Real-Time:** See other players exploring tombs simultaneously
- **In-Game Chat:** Press F8 to communicate with other players
- **Lobby System:** Create private sessions with custom lobby codes
- **PVP Combat:** Toggle player-vs-player mode with F10
- **Community Server:** Connect instantly to the official server, or host your own private server
- **Synchronized Animations:** Watch other Laras jump, climb, swim, and fight in perfect sync

### ⚡ Gameplay Mods

**Customize your adventure with powerful single-player mods:**

#### Super Lara
- **Super Jump** - Launch Lara to incredible heights
- **No Fall Damage** - Survive any fall without taking damage
- **Spider Lara** - Climb any surface like a spider (TR II-V)
- **Glitch Lara** - QWOP-style movement glitch for hilarious chaos (TR I-III)
- **Swim Fly [F11]** - Soar through the air with swim-fly

#### Challenge Modes
- **Perma-damage Mode** - One health bar, for hardcore difficulty
- **Perma-poison Mode** - Continuous poison effect (TR IV-V)

#### Quality of Life
- **Infinite Health** - Auto-heal Lara to maximum health
- **Infinite Oxygen** - Never worry about drowning again

#### Speed Enhancements
- **Super Speed** - Accelerate movement with customizable options:
  - Faster climbing and shimmying
  - Quicker pushblock movement
  - Increased swimming speed

#### Unlocks
- **Unlock Golden Pistols** - Get instant access to the Golden Pistols

---

## How It Works

This launcher uses **Frida** (a dynamic instrumentation toolkit) to modify the game **at runtime**, meaning your game files stay completely untouched. When you close the launcher, the game returns to normal. It's **safe, reversible, and non-invasive**.

✅ **No File Modification**
✅ **Mix & Match Mods** - Enable only the features you want
✅ **Multiplayer Ready** - Join the community server in seconds
✅ **Private Servers** - Host your own multiplayer sessions
✅ **Open Source** - Community-driven development with full transparency

---

## Getting Started

### Step 1: Download
Grab the latest release from the [Releases page](https://github.com/burn-sours/tomb-raider-remastered-multiplayer/releases) (portable executable, no installation required)

### Step 2: Launch
Run the launcher and select your Tomb Raider game when prompted

### Step 3: Choose Your Mods
Toggle features on/off in the launcher interface

### Step 4: Play!
- **Single-Player Mods:** Just click "Launch Mods" and start playing
- **Multiplayer:** Enable multiplayer, enter your player name, and connect to the community server

---

## Hosting a Private Server
You can run your own private server if you do not wish to participate in the Community Server, or if the Community Server is having connection issues. You must have a reachable address on the internet.

The server runs on port **41236** by default. Players connect by selecting "Custom Server" in the launcher and entering your IP address.

### **Windows:**
1. Download the standalone server `.exe` from [releases](https://github.com/burn-sours/tomb-raider-remastered-multiplayer/releases)
2. Run as admin. 
3. You will need to allow the server application to pass through your antivirus and network firewalls.


### **Linux:**
Run from source:
```bash
npm install --production
npm run start-server
```

---

## Building from Source

To build the launcher and server executables yourself:

```bash
npm install
node ./deploy.js
```

The built executables will be in the `releases/` folder:
- **Client launcher:** `releases/Burn's Mods Launcher.exe` (Windows portable)
- **Server:** `releases/Burn's Multiplayer Server.exe` (Windows standalone)

---

## Open Source & Community

This project is **100% open source** under the GPL-3.0 license. We welcome contributions from developers, modders, and enthusiasts of all skill levels!

### Ways to Contribute

🔧 **Code Contributions** - Add new features, fix bugs, or improve performance
💡 **Feature Ideas** - Suggest new mods or multiplayer features
🐛 **Bug Reports** - Help us identify and fix issues
📖 **Documentation** - Improve documentation
🎨 **UI/UX Design** - Enhance the launcher interface

**All contributions that improve the mods are welcome!** Whether you're fixing a typo or implementing a major feature, we appreciate your help making this project better.

---

## Community & Support

🗨️ **Discord** - [Join our community server](https://discord.gg/DJrkR77HJD) for support, updates, and multiplayer coordination
💻 **GitHub Issues** - Report bugs or request features
☕ **Ko-Fi** - [Support ongoing development](https://ko-fi.com/burn_sours)
🌐 **Website** - [Official Burn's Website](https://www.laracrofts.com/)

---

## Technical Overview

**Architecture:**
- **Client:** Electron-based launcher with Frida game integration
- **Server:** Node.js UDP relay server (non-authoritative)
- **Protocol:** Binary UDP packets with zstd compression
- **Injection:** Runtime memory modification via Frida (no file patching)

Want technical details? Check out the [Contributing Guide](documentation/CONTRIBUTING.md).

---

## Credits

**Created by:** burn_sours
**License:** GPL-3.0

Built with contributions from the Tomb Raider modding community.

---

## FAQ

**Q: Does this work on Linux/Mac?**
A: Currently Windows only, though the codebase is designed for potential cross-platform support.

**Q: Can I use this with other mods?**
A: This launcher provides its own mod system. Compatibility with other mods varies.

**Q: Is my saved game safe?**
A: Yes! The launcher doesn't modify save files. Your progress is completely safe.

**Q: How do I stop the mods?**
A: Click the "Stop Mods" button in the launcher, or simply close the game.

**Q: Can I run my own server?**
A: Absolutely! Check the releases for the standalone server executable.

**Q: How can I get involved with the project?**
A: Check out the [Contributing Guide](documentation/CONTRIBUTING.md) to get started!
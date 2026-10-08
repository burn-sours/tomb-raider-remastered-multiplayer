# Burn's Mods & Multiplayer for Tomb Raider Remastered

[Discord](https://discord.gg/DJrkR77HJD) · [Website](https://www.laracrofts.com/) · [Ko-fi](https://ko-fi.com/burn_sours)

A free launcher that adds multiplayer and mods to Tomb Raider I-VI Remastered. Grab it, pick your game, flick on what you fancy, play.

Everything happens at runtime, so your game files and saves stay untouched. Close the launcher and the game's back to normal.

## Getting started

1. Grab the latest launcher from the [releases page](https://github.com/burn-sours/tomb-raider-remastered-multiplayer/releases) and run it.
2. Pick your game and toggle the mods you want.
3. For multiplayer, turn it on, enter a name and connect to the community server. Set a lobby code if you only want your mates in there. Chat is on F8.

Windows only for now. The full rundown of mods and features is on the [website](https://www.laracrofts.com/).

## Hosting your own server

The launcher connects to the community server by default. If you'd rather run your own, you need a machine that's reachable from the internet. The server listens on port 41236, and players join by picking "Custom Server" in the launcher and entering your address.

Windows: grab the server exe from the releases page, run it as admin and let it through your firewall and antivirus.

Linux: run it from source.

```bash
npm install --production
npm run start-server
```

## Building from source

```bash
npm install
npm run deploy
```

The launcher installer and the server exe both end up in `releases/`.

## Contributing

It's all GPL-3.0 and contributions are welcome, whether that's code, bug reports or ideas. Have a read of the [contributing guide](docs/CONTRIBUTING.md) first, and come say hi on Discord before you sink time into anything big.

## Credits

Made by burn_sours.

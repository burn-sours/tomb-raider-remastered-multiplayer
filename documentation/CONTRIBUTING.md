# Contributing Guide

Thanks for your interest in contributing to Burn's Mods & Multiplayer! 

We welcome contributions from everyone, whether you're a confident developer or just getting started.

---

## AI & Modern Development

**AI is the new age of programming**, and we embrace it as a powerful tool for collaboration. Whether you're using ChatGPT, Claude, Copilot, or other AI assistants, they can help you write better code faster.

**However, there are important rules:**

✅ **Use AI as a tool** - AI can help draft code, find bugs, and suggest improvements
✅ **Understand everything you submit** - You must completely understand every line of code in your PR
✅ **Follow existing patterns** - Study the codebase first; your code should match the style and architecture
✅ **Keep it clean** - AI-generated code must be reviewed, refined, and cleaned up before submission
✅ **You are responsible** - You're accountable for your contributions, not the AI

❌ **Don't submit code you don't understand** - If you can't explain how it works, don't submit it
❌ **Don't ignore existing patterns** - Consistency matters more than "clever" solutions

**The goal:** AI should help you contribute better code, not replace your understanding.

---

## Before You Contribute

### Talk First, Code Later

Before spending significant time on a feature or major change:

1. **[Open an issue](issues)** on GitHub to discuss your idea
2. **[Join Discord](https://discord.gg/DJrkR77HJD)** and chat with the community
3. **Get feedback** from maintainers before diving deep into implementation

This saves everyone time and ensures your contribution aligns with the project's direction.

**Small fixes?** (typos, obvious bugs, minor tweaks) - Just submit a PR directly.
**New features or major changes?** - Discuss first.

---

## Code Standards

### Architecture & Patterns

This project follows specific architectural principles:

- **Client-server architecture** with non-authoritative server design
- **Modular, loosely-coupled code** - Respect module boundaries
- **Separation of concerns** - Networking, game logic, and UI are separate
- **KISS principle** - Keep it simple; no over-engineering

### Code Quality

Your code should:

- **Follow existing naming conventions** - Study similar files first
- **Match the existing style** - Look at how things are done and follow that pattern
- **Be self-documenting** - Write clear variable/function names that explain intent
- **Handle errors properly** - Think about edge cases, disconnections, race conditions
- **Stay focused** - Functions should do one thing well
- **Minimize dependencies** - Keep modules loosely coupled

### Feature Development

When adding a new gameplay mod:

1. Look at existing features in `client/features/`
2. Each feature needs a `manifest.json` and `game.js`
3. Follow the plugin architecture pattern
4. Test with all supported game versions
5. Document which games support the feature

---

## Pull Request Process

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code standards above
3. **Test thoroughly** - Make sure it works and doesn't break existing features
4. **Write a clear PR description**:
   - What does this change?
   - Why is it needed?
   - How did you test it?
5. **Be responsive** to feedback and requests for changes

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Include relevant details in the description
- Reference any related issues
- Be patient - maintainers review PRs as time allows

---

## What We're Looking For

Contributions that improve the mods are welcome! This includes:

- **New gameplay features** - Additional mods for Tomb Raider
- **Bug fixes** - Solving issues and improving stability
- **Performance improvements** - Optimizing network code, reducing overhead
- **UI enhancements** - Making the launcher more user-friendly
- **Documentation** - Guides, tutorials, code comments
- **Testing** - Finding and reporting bugs across different game versions

---

## General Guidelines

- Be respectful and constructive in all interactions
- Help newcomers get started
- Test your changes before submitting
- Update documentation if you change behavior
- No malicious code or intentional vulnerabilities
- Follow the GPL-3.0 license terms

---

## Getting Help

- **Discord:** https://discord.gg/DJrkR77HJD - Ask questions, get help, discuss ideas
- **GitHub Issues:** Use for bug reports and feature requests
- **Code Questions:** Join Discord or open a discussion issue

---

## Development Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Make your changes
4. Test locally with `npm run start-client` or `npm run start-server`
5. Build with `node ./deploy.js` to create executables

See the [README](README.md) for more details on building from source.

---

**Thank you for contributing!** Your help makes this project better for the entire Tomb Raider community.

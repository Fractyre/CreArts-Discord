> **Revived for the 2025+ Discord client, BetterDiscord only.** The default left (combined) alignment is fully ported; the other alignment modules still use the old layout.

# CreArts v3.1.0

[![Version](https://img.shields.io/github/package-json/v/Fractyre/CreArts-Discord?labelColor=2e343e&color=%23CD0952&style=for-the-badge)](.github/docs/changelog.md)
[![License](https://img.shields.io/github/license/Fractyre/CreArts-Discord?labelColor=2e343e&color=%23CD0952&style=for-the-badge)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/Fractyre/CreArts-Discord/total?labelColor=2e343e&color=%23CD0952&style=for-the-badge)](https://github.com/Fractyre/CreArts-Discord/releases)
[![Paypal](https://img.shields.io/badge/Donate-PayPal-blue?&labelColor=2e343e&color=%23CD0952&style=for-the-badge)](https://www.paypal.com/donate/?hosted_button_id=5MQYGQ2FGQDWJ)
[![Discord](https://img.shields.io/discord/534376415202639903?label=Discord&labelColor=2e343e&color=%23CD0952&style=for-the-badge)](https://discord.gg/8W8E39Z)

**CreArts-Discord** is a theme for [Discord](https://discord.com) that gives you a new modern interface and adds at the same time many possibilities to be customized, one of the core features are [Skins](.github/docs/skins.md), which allow you to customize the appearance with [Variables](.github/docs/variables.md). The goal of this Discord theme is to wrap the standard Discord charm in a new visual idea.

This project is licensed under the [MIT License](LICENSE), even though this project is under the MIT license, we would appreciate any recognition. CreArts is a [BetterDiscord](https://github.com/BetterDiscord/BetterDiscord) theme; support for other client mods was dropped in the revival.

## Preview

![Header](https://user-images.githubusercontent.com/58918358/125176488-0d74b200-e1d4-11eb-845a-b8ee0e794631.png)

<table>
  <tr>
    <th><img src="https://i.imgur.com/1jC9rrs.png"></th>
    <th><img src="https://i.imgur.com/iXCZnoA.png"></th>
    <th><img src="https://i.imgur.com/jV3JQc1.png"></th>
  </tr>
  <tr>
    <td><b>Guild</b></td>
    <td><b>Home</b></td>
    <td><b>Explore</b></td>
  </tr>
</table>

## Getting Started

CreArts is a [BetterDiscord](https://betterdiscord.app) theme. Install BetterDiscord first, then use either of the methods below.

## Installation

<!-- BetterDiscord -->
<details>
<summary><b>BetterDiscord (Theme File)</b></summary>

* **Step 1:** Download [`clients/crearts.theme.css`](https://github.com/Fractyre/CreArts-Discord/blob/master/clients/crearts.theme.css).

* **Step 2:** Open **User Settings → Themes → Open Themes Folder** and paste the file there.

* **Step 3:** Enable **CreArts v3** in the theme list. Open the file to toggle skins and modules by commenting or uncommenting their `@import` lines.
</details>

<!-- CSS Import -->
<details>
<summary><b>BetterDiscord (Custom CSS)</b></summary>

* **Step 1:** Open **User Settings → Custom CSS**.

* **Step 2:** Paste the import at the top:

```css
@import url("https://fractyre.github.io/CreArts-Discord/clients/crearts.theme.css");
```
</details>

<!-- Development -->
<details>
<summary><b>Development</b></summary>

```bash
pnpm install
pnpm run dev            # live build into BetterDiscord's themes folder as "CreArts Dev"
pnpm run build          # compile src/source.css and modules/custom/*.css
pnpm run check-classes  # list selectors that no longer exist in Discord
```
</details>

## Credits

Originally created by [CorellanStoma](https://github.com/CorellanStoma) and contributors. Revived for the 2025+ Discord client by [Fractyre](https://github.com/Fractyre).

This theme uses extensions from other theme creators:

* [**Discolored**](https://github.com/NYRI4/Discolored) | *Colorize Discord's boring SVGs.*

## Support

If you have problems, found some bugs or have wishes for this theme, create a [Issue](https://github.com/Fractyre/CreArts-Discord/issues) or join our [Community](https://discord.gg/8W8E39Z) and communicate with us.

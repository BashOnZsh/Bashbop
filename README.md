# [<img src="/static/icon.png" width="40" align="left" alt="Bashbop">](https://github.com/BashOnZsh/Bashbop) Bashbop

Bashbop est un client Discord Desktop basé sur Vesktop, avec l'ecosysteme Bashcord preinstalle.

[![Bashcord](https://img.shields.io/badge/Bashcord-grey?style=flat)](https://github.com/BashOnZsh/Bashcord)
[![Tests](https://github.com/BashOnZsh/Bashbop/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/BashOnZsh/Bashbop/actions/workflows/test.yml)
[![Discord](https://img.shields.io/discord/1173279886065029291.svg?color=768AD4&label=Discord&logo=discord&logoColor=white)](https://bashcord.org/discord)

## A propos de Bashbop

Bashbop vise une experience Discord Desktop rapide et propre, avec:

- Plugins Bashcord charges automatiquement
- Integrations Linux utiles (screenshare son, Wayland, tray)
- Build et packaging multiplateforme via Bun + Electron Builder
- Reglages et runtime separes du client Discord officiel

## Fonctionnalites

- Bashcord preinstalle
- Demarrage et UI legers
- Linux screenshare avec son + Wayland
- Personnalisation du tray (badges, status voix)
- Arguments de lancement et flags persistants
- Support arRPC-bun avec logs debug

## Plugins et mises a jour

Bashbop telecharge et utilise le bundle Bashcord au format asar:

```text
https://github.com/BashOnZsh/Bashcord/releases/download/latest/bashbop.asar
```

Au runtime, ce bundle fournit les plugins disponibles dans l'application.

## Installation

### Binaries

- Releases GitHub: https://github.com/BashOnZsh/Bashbop/releases
- Site: https://bashcord.org/download

### Linux

[![Equibop](https://img.shields.io/badge/AVAILABLE_ON_THE_AUR-333232?style=for-the-badge&logo=arch-linux&logoColor=0F94D2&labelColor=%23171717)](https://aur.archlinux.org/packages?O=0&K=equibop)

Packages communautaires (non officiels):

- Arch Linux: https://aur.archlinux.org/packages?K=equibop
- Void Linux: https://void.creations.works/
- NixOS: `nix-shell -p equibop`

## Arguments Bashbop

### Runtime flags

Ces flags peuvent etre passes au lancement
(ou via clic droit sur l'icone tray > Launch arguments):

```bash
--wayland
```

Force la plateforme Ozone Wayland.
Active aussi:

- `WaylandWindowDecorations`
- `VaapiVideoDecodeLinuxGL`

Alternative basique:

```bash
--enable-features=UseOzonePlatform --ozone-platform=wayland
```

```bash
--no-sandbox
```

Desactive le sandbox Chromium (souvent utile en root).

```bash
--force_high_performance_gpu
```

Priorise le GPU dedie.

### Build flags

```bash
--dev
```

Active le mode dev (pas de minification + `IS_DEV=true`).

```bash
--watch
```

Build en watch continu.

### Fichier de flags persistant

```text
${XDG_CONFIG_HOME}/equibop-flags.conf
```

Regles:

- Les lignes vides sont ignorees
- Les lignes commencant par `#` sont des commentaires
- Les lignes valides sont ajoutees a la commande de lancement

## Developpement

### Prerequis

- Git
- Bun (>= 1.3)
- Node.js (recommande pour l'ecosysteme outils)

### Commandes utiles

```bash
# Installer les dependances
bun install

# Build production
bun run build

# Build developpement
bun run build:dev

# Lancer l'application
bun start

# Lancer en dev
bun run start:dev

# Lancer avec watch
bun run start:watch

# Lint + tests types
bun run test
```

### Build depuis les sources

```bash
git clone https://github.com/BashOnZsh/Bashbop
cd Bashbop
bun install
bun start
```

### Packaging

```bash
# Packages pour ton OS
bun run package

# Build dossier sans installer
bun run package:dir
```

## Build LibVesktop (Linux)

LibVesktop est une librairie C++ utilisee pour les evenements D-Bus.
Par defaut, des binaires prebuild x64/arm64 sont utilises.

Pour compiler localement:

1. Installer les dependances:
   - Debian/Ubuntu: `apt install build-essential python3 curl pkg-config libglib2.0-dev`
   - Fedora: `dnf install @c-development @development-tools python3 curl pkgconf-pkg-config glib2-devel`
2. Lancer:

```bash
bun run buildLibVesktop
```

## Contribution

1. Fork du repository
2. Creer une branche: `git checkout -b feature/ma-feature`
3. Commit: `git commit -m "feat: ma feature"`
4. Push
5. Ouvrir une Pull Request

## Avertissement

Comme les autres clients modifies, Bashbop peut contrevenir aux CGU de Discord.
Utilise-le en connaissance de cause et evite les plugins a comportement abusif.

## Support

- Discord: https://bashcord.org/discord
- Repository: https://github.com/BashOnZsh/Bashbop

## Licence

GPL-3.0-or-later. Voir LICENSE.

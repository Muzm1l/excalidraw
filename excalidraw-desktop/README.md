# Excalidraw (Linux desktop)

Electron wrapper around the Excalidraw web app. Builds **AppImage** and **deb** packages on Linux.

## Prerequisites

- **Node.js** 18 or newer
- **Yarn** 1.x (the repo uses `yarn@1.22.22`)
- From the **repository root**, run `yarn install` once so workspaces and dependencies are linked.

To produce `.deb` packages, your system should have the usual packaging tools (many distros ship them; on Debian/Ubuntu you may need `fakeroot` and `dpkg` if they are missing).

## Build installers from source

From the **monorepo root**:

```bash
yarn build:desktop
```

This runs a production build of the web app (with settings suitable for Electron) and then runs `electron-builder` for Linux.

Output directory:

```text
excalidraw-desktop/dist/
```

You should see an **AppImage** (`.AppImage`) and a **Debian package** (`.deb`). Exact file names include the version and CPU architecture (for example `x64` or `arm64`).

### Unpacked folder only (no AppImage/deb)

Useful for quick local testing:

```bash
yarn --cwd excalidraw-desktop electron:pack
```

The runnable binary is under `excalidraw-desktop/dist/linux-unpacked/` (executable: `excalidraw`). Some environments need `--no-sandbox` if sandboxing fails; prefer the packaged AppImage or deb for normal use.

## Install the AppImage

1. Mark it executable:

   ```bash
   chmod +x Excalidraw-*.AppImage
   ```

2. Run it:

   ```bash
   ./Excalidraw-*.AppImage
   ```

To integrate with your desktop (menu entry, updates helpers), tools such as [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) are optional but convenient.

## Install the deb package

From the directory that contains the built `.deb`:

```bash
sudo apt install ./Excalidraw-*.deb
```

Or:

```bash
sudo dpkg -i Excalidraw-*.deb
sudo apt-get install -f   # if dpkg reports missing dependencies
```

Then launch **Excalidraw** from your application menu or run `excalidraw` in a terminal if that command is on your `PATH`.

## Development (live reload)

From the **monorepo root**:

```bash
yarn electron:dev
```

This starts the Vite dev server for `excalidraw-app` and opens an Electron window pointed at `http://127.0.0.1:3000`. Stop with Ctrl+C in the terminal.

## Troubleshooting

- **Build fails in `excalidraw-desktop`:** Run `yarn install` from the repo root and ensure you are on Linux when building Linux targets (or use a Linux VM/CI).
- **AppImage does not run:** On some systems, FUSE or `libfuse` compatibility is required; check [AppImage documentation](https://docs.appimage.org/user-guide/troubleshooting/index.html) for your distribution.

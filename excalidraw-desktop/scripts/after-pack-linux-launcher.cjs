"use strict";

const fs = require("fs/promises");
const path = require("path");

/**
 * Chromium validates the setuid sandbox before Electron loads main.cjs. The deb
 * postinst often leaves chrome-sandbox as non-setuid when user namespaces exist,
 * but Electron can still refuse to start. A tiny shell wrapper ensures the same
 * flags are used for menu, `excalidraw` in PATH, and `/opt/.../excalidraw`.
 *
 * @param {import("electron-builder").AfterPackContext} context
 */
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") {
    return;
  }

  const { appOutDir, packager } = context;
  const exeName = packager.executableName;
  if (exeName == null || exeName === "") {
    return;
  }

  const exePath = path.join(appOutDir, exeName);
  const realPath = `${exePath}.bin`;

  try {
    await fs.rename(exePath, realPath);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      return;
    }
    throw err;
  }

  const launcher = `#!/bin/sh
exec "$(dirname "$0")/${exeName}.bin" --no-sandbox --disable-setuid-sandbox "$@"
`;

  await fs.writeFile(exePath, launcher, { encoding: "utf8", mode: 0o755 });
};

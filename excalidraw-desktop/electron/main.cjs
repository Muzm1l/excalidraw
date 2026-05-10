const { app, BrowserWindow } = require("electron");
const path = require("path");

// Installed .deb/AppImage trees usually ship `chrome-sandbox` without setuid
// root; Chromium then aborts on startup (often reported as SIGTRAP on Ubuntu/Wayland).
if (process.platform === "linux") {
  app.commandLine.appendSwitch("disable-setuid-sandbox");
  app.commandLine.appendSwitch("no-sandbox");
}

const devUrl =
  process.env.EXCALIDRAW_DESKTOP_DEV_URL || "http://127.0.0.1:3000";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (!app.isPackaged) {
    void win.loadURL(devUrl);
  } else {
    void win.loadFile(
      path.join(__dirname, "..", "renderer", "index.html"),
    );
  }
}

void app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

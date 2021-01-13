// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  shell,
} = require("electron");
const path = require("path");

let homeWindow, paletteWindow;
let paletteOpen = false;

app.whenReady().then(() => {
  createHomeWindow();

  globalShortcut.register("Alt+CommandOrControl+Z", () => {
    if (!paletteOpen) {
      createPaletteWindow();
      paletteOpen = true;
    }
    paletteWindow.webContents.send("fromMain", screen.getCursorScreenPoint());
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createHomeWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function createHomeWindow() {
  homeWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });

  homeWindow.loadFile("src/home/home.html");

  // win.webContents.openDevTools();

  const handleRedirect = (e, url) => {
    if (url !== e.sender.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  homeWindow.webContents.on("will-navigate", handleRedirect);
}

function createPaletteWindow() {
  paletteWindow = new BrowserWindow({
    show: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // paletteWindow.webContents.openDevTools();

  paletteWindow.on("closed", () => {
    paletteOpen = false;
  });

  paletteWindow.loadFile("src/palette/palette.html");
  paletteWindow.maximize();
  paletteWindow.show();
}

ipcMain.on("toMain", (event, ...args) => {
  if (args[0] == "coords") {
    paletteWindow.webContents.send("fromMain", screen.getCursorScreenPoint());
  } else if (args[0] == "mode") {
    selectedMode = args[1];
    paletteWindow.close();
  }
});

const {
  app,
  BrowserWindow,
  Notification,
  globalShortcut,
  ipcMain,
  screen,
  shell,
} = require("electron");
const path = require("path");
const macro = require("./macro");

let homeWindow, paletteWindow;
let paletteOpen = false;
let cachedSettings;

app.whenReady().then(() => {
  createHomeWindow();

  globalShortcut.register("Alt+CommandOrControl+Z", () => {
    if (!paletteOpen) {
      createPaletteWindow();
      paletteOpen = true;
    }
    paletteWindow.webContents.send(
      "fromMain",
      screen.getCursorScreenPoint(),
      screen.getPrimaryDisplay().workAreaSize,
      getSettings()
    );
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
  if (args[0] == "setup") {
    paletteWindow.webContents.send(
      "fromMain",
      screen.getCursorScreenPoint(),
      screen.getPrimaryDisplay().workAreaSize,
      getSettings()
    );
  } else if (args[0] == "mode") {
    selectedMode = args[1];
    paletteWindow.close();
    let keybindOptions = getSettings()[selectedMode];
    let keybind;
    if (process.platform !== "darwin") {
      keybind = keybindOptions.windows;
    } else {
      keybind = keybindOptions.mac;
    }
    let result = macro.executeShortcut(keybind);
    if (!result) {
      const notification = {
        title: "ERROR",
        body:
          "This keybind either does not exist on your operating system or is not currently mapped.",
      };
      new Notification(notification).show();
    }
  }
});

function getSettings() {
  // TODO: Implement persistent storage
  if (cachedSettings == null) {
    let settingsObj = {
      Undo: {
        mac: {
          global: false,
          key: "z",
          modifier: ["command"],
        },
        windows: {
          global: false,
          key: "z",
          modifier: ["ctrl"],
        },
      },
      Redo: {
        mac: {
          global: false,
          key: "z",
          modifier: ["command", "shift"],
        },
        windows: {
          global: false,
          key: "y",
          modifier: ["ctrl"],
        },
      },
      Enter: {
        mac: {
          global: false,
          key: "enter",
          modifier: [],
        },
        windows: {
          global: false,
          key: "enter",
          modifier: [],
        },
      },
      "Zoom In": {
        mac: {
          global: false,
          key: "=",
          modifier: ["command"],
        },
        windows: {
          global: false,
          key: "+",
          modifier: ["command"],
        },
      },
      "Zoom Out": {
        mac: {
          global: false,
          key: "-",
          modifier: ["command"],
        },
        windows: {
          global: false,
          key: "-",
          modifier: ["command"],
        },
      },
      Keyboard: {
        mac: {
          global: true,
          key: "NULL",
          modifier: [],
        },
        windows: {
          global: true,
          key: "o",
          modifier: ["command", "ctrl"],
        },
      },
      Capture: {
        mac: {
          global: true,
          key: "5",
          modifier: ["command", "shift"],
        },
        windows: {
          global: true,
          key: "s",
          modifier: ["command", "shift"],
        },
      },
    };
    cachedSettings = settingsObj;
  }

  return cachedSettings;
}

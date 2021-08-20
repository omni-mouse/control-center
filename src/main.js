const {
  app,
  BrowserWindow,
  Notification,
  globalShortcut,
  ipcMain,
  screen,
  shell,
  clipboard,
} = require("electron");
const path = require("path");
const glasstron = require("glasstron");
const macro = require("./macro");
const settings_data = require('./constants/settings.json');

let homeWindow, paletteWindow, keyboardWindow;
let paletteCoords;
let paletteOpen = false;

let keyboardContent = '';
let keyboardOpen = false;

let cachedSettings;

app.whenReady().then(() => {
  createHomeWindow();

  globalShortcut.register("Alt+CommandOrControl+Z", () => {
    if (!paletteOpen) {
      createPaletteWindow();
      paletteOpen = true;
    }

    keyboardContent = getSelectedText();
    paletteCoords = screen.getCursorScreenPoint();
    paletteWindow.webContents.send(
      "fromMain",
      paletteCoords,
      screen.getDisplayNearestPoint(paletteCoords).workAreaSize,
      getSettings()
    );
  });

  globalShortcut.register("Alt+CommandOrControl+K", () => {
    if (!keyboardOpen) {
      createKeyboardWindow();
      keyboardOpen = true;
    }
    keyboardWindow.webContents.send("fromMain");
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

  // homeWindow.webContents.openDevTools();

  const handleRedirect = (e, url) => {
    if (url !== e.sender.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  homeWindow.webContents.on("will-navigate", handleRedirect);
}

function createPaletteWindow() {
  paletteWindow = new glasstron.BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });

  paletteWindow.on("closed", () => {
    paletteOpen = false;
  });

  app.dock.hide();
  paletteWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  paletteWindow.setAlwaysOnTop(true, "floating");
  paletteWindow.setFullScreenable(false);

  paletteWindow.loadFile("src/palette/palette.html");
  paletteWindow.blurType = "transparent";
  paletteWindow.setBlur(true);
  paletteWindow.maximize();
  paletteWindow.show();
}

function createKeyboardWindow() {
  keyboardWindow = new glasstron.BrowserWindow({
    width: 800,
    height: 300,
    show: false,
    frame: true,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
    useContentSize: true,
  });

  keyboardWindow.on("closed", () => {
    keyboardOpen = false;
    keyboardContent = '';
  });

  app.dock.hide();
  keyboardWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  keyboardWindow.setAlwaysOnTop(true, "floating");
  keyboardWindow.setFullScreenable(false);

  // keyboardWindow.webContents.openDevTools();

  keyboardWindow.loadFile("src/keyboard/keyboard.html");
  keyboardWindow.show();
}

ipcMain.on("toMain", (event, ...args) => {
  if (args[0] === "setup") {
    paletteWindow.webContents.send(
      "fromMain",
      screen.getCursorScreenPoint(),
      screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workAreaSize,
      getSettings()
    );
  } else if (args[0] === "mode") {
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
        body: "This keybind either does not exist on your operating system or is not currently mapped.",
      };
      new Notification(notification).show();
    }
  } else if (args[0] === "keyboard") {
    keyboardWindow.webContents.send("fromMain", keyboardContent);
  } else if (args[0] === "button") {
    keyboardWindow.close();
    let result = macro.pressButton(args[1], args[2], paletteCoords);
    
    if (!result) {
      const notification = {
        title: "ERROR",
        body: "This keybind either does not exist on your operating system or is not currently mapped.",
      };
      new Notification(notification).show();
    }
  }
});

function getSettings() {
  // TODO: Implement persistent storage
  if (cachedSettings == null) {    
    cachedSettings = settings_data;
  }

  return cachedSettings;
}

async function getSelectedText() {
  const originalClipboard = clipboard.readText(); // preserve clipboard content
  clipboard.clear();
  macro.copyToClipboard();
  await new Promise((resolve) => setTimeout(resolve, 200)); // add a delay before checking clipboard
  keyboardContent = clipboard.readText();
  clipboard.writeText(originalClipboard);  
}

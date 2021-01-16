const robot = require("robotjs");

function executeShortcut(settingsObj, selectedMode) {
  let keybindOptions = settingsObj[selectedMode];
  let key = 0;
  let keybind;

  // If Windows/Linux
  if (process.platform !== "darwin") {
    keybind = keybindOptions.windows;
  } else {
    keybind = keybindOptions.mac;
  }

  if (keybind.key.includes("NULL")) {
    return;
  }

  robot.setKeyboardDelay(50);
  robot.keyTap(keybind.key, keybind.modifier);
}

module.exports = { executeShortcut };

const robot = require("robotjs");

function executeShortcut(keybind) {
  if (keybind.key.includes("NULL")) {
    return false;
  }
  robot.setKeyboardDelay(50);

  // To highlight the correct application (previous one used before electron opens)
  if (!keybind.global) {
    // robot.keyTap("tab", ["command"]);
    // robot.keyTap("enter");
    robot.mouseClick();
  }

  robot.keyTap(keybind.key, keybind.modifier);
  return true;
}

function pressButton(text, replace, paletteCoords) {
  robot.moveMouse(paletteCoords.x, paletteCoords.y);
  robot.mouseClick();
  // TODO: Not a reliable way to delete, can delete whole file
  if (replace) {
    robot.keyTap("a", process.platform === "darwin" ? "command" : "control");
    robot.keyTap("delete");
  }
  robot.typeString(text);

  return true;
}

function copyToClipboard() {
  // To highlight the correct application (previous one used before electron opens)
  robot.mouseClick();

  robot.keyTap("c", process.platform === "darwin" ? "command" : "control");
}

module.exports = { executeShortcut, pressButton, copyToClipboard };

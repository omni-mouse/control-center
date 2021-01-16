const robot = require("robotjs");

function executeShortcut(keybind) {
  if (keybind.key.includes("NULL")) {
    return false;
  }
  robot.setKeyboardDelay(50);

  // To highlight the correct application (previous one used before electron opens)
  if (!keybind.global) {
    robot.keyTap("tab", ["command"]);
    robot.keyTap("enter");
  }

  robot.keyTap(keybind.key, keybind.modifier);
  return true;
}

module.exports = { executeShortcut };

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

function pressButton(button, currentCoords, paletteCoords) {
  robot.setKeyboardDelay(50);

  // HOW TO TYPE IN CORRECT LOCATION? 
  // STRAT 1 = move cursor from current to palette back to current
  robot.keyTap(button);  

  return true;
}

module.exports = { executeShortcut, pressButton };

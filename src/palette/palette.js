window.setup.send("toMain");

window.setup.receive("fromMain", (coords, dimensions, settingsObj) => {
  let settings = Object.keys(settingsObj);
  wheel = new wheelnav(
    "wheelDiv",
    null,
    dimensions.width - 20,
    dimensions.height - 20
  );
  wheel.wheelRadius = 200;
  wheel.centerX = coords.x;
  wheel.centerY = coords.y;
  wheel.clickModeRotate = false;
  wheel.colors = ["#1665ac"];
  wheel.slicePathFunction = slicePath().DonutSlice;
  wheel.initWheel(settings);

  for (let i = 0; i < settings.length; i++) {
    wheel.navItems[i].tooltip = settings[i];
    wheel.navItems[i].navigateFunction = function () {
      modeSelected(settings[i]);
    };
  }

  wheel.selectedNavItemIndex = null;
  wheel.createWheel();
});

function modeSelected(selectedMode) {
  // TODO: Close wheel if no mode is selected
  window.mode.send("toMain", selectedMode);
}

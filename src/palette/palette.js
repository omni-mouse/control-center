window.setup.send("toMain");

window.setup.receive("fromMain", (coords, dimensions, settings) => {
  wheel = new wheelnav("wheelDiv", null, dimensions.width, dimensions.height);
  wheel.wheelRadius = 200;
  wheel.centerX = coords.x;
  wheel.centerY = coords.y;
  wheel.clickModeRotate = false;
  wheel.colors = ["#1665ac"];
  wheel.slicePathFunction = slicePath().DonutSlice;
  wheel.initWheel(settings);

  // TODO: automate the tooltips and setting the functions based on size of settings
  wheel.navItems[0].tooltip = settings[0];
  wheel.navItems[1].tooltip = settings[1];
  wheel.navItems[2].tooltip = settings[2];
  wheel.navItems[3].tooltip = settings[3];
  wheel.navItems[4].tooltip = settings[4];
  wheel.navItems[5].tooltip = settings[5];

  wheel.navItems[0].navigateFunction = function () {
    modeSelected(settings[0]);
  };
  wheel.navItems[1].navigateFunction = function () {
    modeSelected(settings[1]);
  };
  wheel.navItems[2].navigateFunction = function () {
    modeSelected(settings[2]);
  };
  wheel.navItems[3].navigateFunction = function () {
    modeSelected(settings[3]);
  };
  wheel.navItems[4].navigateFunction = function () {
    modeSelected(settings[4]);
  };
  wheel.navItems[5].navigateFunction = function () {
    modeSelected(settings[5]);
  };

  wheel.selectedNavItemIndex = null;
  wheel.createWheel();
});

function modeSelected(selectedMode) {
  window.mode.send("toMain", selectedMode);
}

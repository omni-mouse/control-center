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
  
  adjustCoords(coords, dimensions);
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

function adjustCoords(coords, dimensions) {
  if (coords.x + 200 > dimensions.width) {
    coords.x = dimensions.width - 200;
  } else if (coords.x - 200 < 0) {
    coords.x = 200;
  }
  if (coords.y + 200 > dimensions.height) {
    coords.y = dimensions.height - 200;
  } else if (coords.y - 200 < 0) {
    coords.y = 200;
  }
}

function modeSelected(selectedMode) {
  // TODO: Close wheel if no mode is selected
  window.mode.send("toMain", selectedMode);
}

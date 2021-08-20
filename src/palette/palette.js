const wheelRadius = 200;

window.setup.send("toMain");

window.setup.receive("fromMain", (coords, dimensions, settingsObj) => {
  let settings = Object.keys(settingsObj);
  wheel = new wheelnav(
    "wheelDiv",
    null,
    dimensions.width - 20,
    dimensions.height - 20
  );
  wheel.wheelRadius = wheelRadius;
  
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

  document.addEventListener("click", (event) => {
    handleClick(event, coords)
  });


  wheel.selectedNavItemIndex = null;
  wheel.createWheel();
});

function handleClick(event, coords) {
  console.log(event.clientX, event.clientY);
  let a = event.clientX - coords.x;
  let b = event.clientY - coords.y;
  let distance = Math.sqrt( a*a + b*b );
  if (distance > wheelRadius) {
    modeSelected("Close");
  }
}

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
  window.mode.send("toMain", selectedMode);
}

let showing = false;
let anchorX;
let anchorY;
let hole = 100;

const wheel = document.querySelector(".wheel");

window.coords.send("toMain");

window.coords.receive("fromMain", (data) => {
  showing = true;
  document.body.addEventListener(
    "contextmenu",
    (e) => e.preventDefault() & e.stopPropagation()
  );
  document.body.addEventListener("click", selectMode);
  document.body.addEventListener("mousemove", onMouseMove);
  openPalette(data.x, data.y);
});

function openPalette(x, y) {
  anchorX = x;
  anchorY = y;

  wheel.style.top = y + "px";
  wheel.style.left = x + "px";
  wheel.classList.add("on");
}

function selectMode() {
  showing = false;

  window.mode.send("toMain", wheel.getAttribute("data-chosen"));

  wheel.setAttribute("data-chosen", 0);
  wheel.classList.remove("on");
}

function onMouseMove({ clientX: x, clientY: y }) {
  if (!showing) {
    return;
  }

  let dx = x - anchorX;
  let dy = y - anchorY;
  let length = Math.sqrt(dx * dx + dy * dy);
  let index = 0;

  if (length >= hole) {
    let deg = Math.atan2(dy, dx) + 0.625 * Math.PI;
    while (deg < 0) {
      deg += Math.PI * 2;
    }
    index = Math.floor((deg / Math.PI) * 4) + 1;
  }

  wheel.setAttribute("data-chosen", index);
}

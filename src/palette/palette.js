window.coords.send("toMain");

window.coords.receive("fromMain", (data) => {
  document.getElementById("coords").innerHTML = data.x + " " + data.y;

  var palette = document.getElementById("palette");
  palette.style.top = data.y + "px";
  palette.style.left = data.x + "px";
});

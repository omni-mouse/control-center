window.keyboard.send("toMain");

window.keyboard.receive("fromMain", () => {
  let Keyboard = window.SimpleKeyboard.default;
  let swipe = window.SimpleKeyboardSwipe.default;
  
  let keyboard = new Keyboard({
    onKeyPress: button => onKeyPress(button),
    useMouseEvents: true,
    modules: [
      swipe
    ]
  });
  
  function onKeyPress(button){
    let timeout = null;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      window.button.send("toMain", button);
    }, 500);
  }
});

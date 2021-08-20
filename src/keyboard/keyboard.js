window.keyboard.send("toMain");

window.keyboard.receive("fromMain", () => {
  let Keyboard = window.SimpleKeyboard.default;
  let swipe = window.SimpleKeyboardSwipe.default;
  
  let keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: (button) => onFinish(button), 
    useMouseEvents: true,
    modules: [
      swipe
    ]
  });

  document.querySelector(".input").addEventListener("input", event => {
    keyboard.setInput(event.target.value);
  });
  
  function onFinish(button){
    if (button.includes("enter")) {
      window.button.send("toMain", document.getElementById('input').value);
    }
  } 

  function onChange(input) {
    document.querySelector(".input").value = input;
  }
});

let index;
let menu_links = document.getElementById("menu");
let items = menu_links.getElementsByClassName("menu-item");

for (let i = 0; i < items.length; i++) {
  items[i].addEventListener("click", function () {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    updateView(this.id);
  });
}

function updateView(id) {
  let page_container = document.getElementById("pages");
  let pages = page_container.getElementsByClassName("page");
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].id == id) {
      pages[i].className = "page active-page";
    } else {
      pages[i].className = "page";
    }
  }
}

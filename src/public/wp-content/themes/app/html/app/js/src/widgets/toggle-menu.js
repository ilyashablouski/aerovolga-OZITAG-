class ToggleMenu {
  constructor(item, menu) {
    this.toggleMenu = item;
    this.menu = menu;

    this.addEvents();
  }

  addEvents() {
    this.toggleMenu.addEventListener('click', () => {
      if (this.toggleMenu.classList.contains('active')) {
        this.removeActive(this.toggleMenu);
        this.removeActive(this.menu);
      } else {
        this.setActive(this.toggleMenu);
        this.setActive(this.menu);
      }
    });
  }

  setActive(elem) {
    elem.classList.add('active');
  }

  removeActive(elem) {
    elem.classList.remove('active');
  }

  static init(elem, menu) {
    new ToggleMenu(elem, menu);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleMenu = document.querySelectorAll('.js-toggle-menu');
  const menu = document.querySelector('.js-menu');
  toggleMenu.forEach(item => {
    ToggleMenu.init(item, menu);
  });
});

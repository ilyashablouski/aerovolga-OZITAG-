class Spinner {
  constructor(node) {
    this.node = node;
    this.image = node.querySelector('img');

    this.events();
  }

  events() {
    this.node.classList.add('loading');

    this.image.addEventListener("load", () => {
      this.node.classList.remove('loading');
    });
  }

  static init(element) {
    new Spinner(element);
  }
}

class SpinnerUI {
  static init() {
    const images = document.querySelectorAll('.js-image-loading');
    images.forEach(item => {
      Spinner.init(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  SpinnerUI.init();
});

class Spinner {
  constructor(node) {
    this.node = node;

    this.image = node.querySelector('img');
    if (!this.image) {
      return;
    }

    this.events();
    this.hiddenSpinner();
  }

  events() {
    this.node.classList.add('loading');

    this.image.addEventListener('load', () => {
      this.node.classList.remove('loading');
    });

    onScroll(() => {
      this.hiddenSpinner();
    });
  }

  hiddenSpinner() {
    if (!this.node.classList.contains('loading')) return;

    const imagePosition = {
      top: window.pageYOffset + this.node.getBoundingClientRect().top,
      bottom: window.pageYOffset + this.node.getBoundingClientRect().bottom,
    };

    const windowPosition = {
      top: window.pageYOffset,
      bottom: window.pageYOffset + document.documentElement.clientHeight,
    };

    if (imagePosition.bottom > windowPosition.top &&
      imagePosition.top < windowPosition.bottom) {

      setTimeout(() => {
        this.node.classList.remove('loading');
      }, 5000);
    }
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

subscribeToEvent('initModules', () => {
  SpinnerUI.init();
});

const configs = {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 2000,
  },
  pagination: {
    el: '.hh-pagination',
    type: 'bullets',
    bulletElement: 'button',
    bulletClass: 'hh-pagination__item',
    bulletActiveClass: 'active',
    clickable: true,
  },
  cubeEffect: {
    slideShadows: false,
    shadow: false,
  },

};

class PreviewsSlider {
  constructor(nodeElement) {
    this.slider = null;
    this.container = nodeElement;

    this.initialize();
  }

  initialize() {
    this.handleResize();
    onResize(() => {
      this.handleResize();
    });
  }

  handleResize() {
    if (isLaptopLayout()) !this.slider && this.initSlider();
    else this.slider && this.destroySlider();
  }

  initSlider() {
    this.slider = new Swiper(this.container, configs);
  }

  destroySlider() {
    this.slider.destroy(true, true);
    this.slider = null;
  }

  static createInstance(container) {
    return new PreviewsSlider(container);
  }
}

subscribeToEvent('initModules', () => {
  document.querySelectorAll('.js-previews').forEach(node => {
    PreviewsSlider.createInstance(node);
  });
});

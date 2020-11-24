class FreeScrollSlider {

  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
  }

  initSlider() {
    this.slider = new Swiper(this.nodeElement, {
      slidesPerView: 'auto',
      speed: 600,
      effect: "slide",
      spaceBetween: 17,
      slideToClickedSlide: true,
      freeMode: true,
      breakpoints: {
        768: {
          spaceBetween: 60,
        },
      },
    });
  }

  static init(elem) {
    new FreeScrollSlider(elem);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-free-scroll-slider');
  slider.forEach(item => {
    FreeScrollSlider.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-free-scroll-slider');
  slider.forEach(item => {
    FreeScrollSlider.init(item);
  });
});

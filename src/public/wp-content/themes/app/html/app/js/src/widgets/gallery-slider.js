const configs = {
  speed: 600,
  autoplay: {
    delay: 2000,
  },
  navigation: {
    nextEl: '.gallery-slider__next',
    prevEl: '.gallery-slider__prev'
  },
  pagination: {
    el: '.gallery-slider__pagination',
    type: 'bullets',
    clickable: true,
  },
  effect: 'coverflow',
  coverflowEffect: {
    slideShadows: false,
  },
  cubeEffect: {
    slideShadows: false,
    shadow: false,
  },

};

class GallerySlider {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
  }

  initSlider() {
    this.swiper = new Swiper(this.nodeElement, configs);
  }

  static init(elem) {
    new GallerySlider(elem);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-gallery-slider');
  slider.forEach(item => {
    GallerySlider.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-gallery-slider');
  slider.forEach(item => {
    GallerySlider.init(item);
  });
});
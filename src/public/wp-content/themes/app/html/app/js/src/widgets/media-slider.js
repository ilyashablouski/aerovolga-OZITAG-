const configs = {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 2000,
  },
  navigation: {
    nextEl: '.media__slider-next',
    prevEl: '.media__slider-prev'
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

class MediaSlider {
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
    new MediaSlider(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-media-slider');
  slider.forEach(item => {
    MediaSlider.init(item);
  });
});

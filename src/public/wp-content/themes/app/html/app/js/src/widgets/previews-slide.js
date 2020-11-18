const configs = {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 2000,
  },
  pagination: {
    el: '.preview-slider__pagination',
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

class PreviewsSlider {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    if(window.innerWidth < 1023) {
      this.initSlider();
    }
  }

  initSlider() {
    this.swiper = new Swiper(this.nodeElement, configs);
  }

  static init(elem) {
    new PreviewsSlider(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-previews');
  slider.forEach(item => {
   PreviewsSlider.init(item);
  });
});

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
      speed: 800,
      slidesPerView: 'auto',
      spaceBetween: 30,
      freeMode: true,
    });
  }

  static init(elem) {
    new FreeScrollSlider(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-free-scroll-slider');
  slider.forEach(item => {
    FreeScrollSlider.init(item);
  });
});

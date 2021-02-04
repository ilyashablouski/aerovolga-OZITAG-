class ModificationsSlider {
  queryElement(componentName) {
    const element = this.nodeElement.querySelector('.js-modifications-slider__' + componentName);

    if (!element) {
      console.warn(`JS Double Slider - ${componentName} not found`);
    }

    return element;
  }

  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.rowElement = this.queryElement('row');
    this.thumbs = this.queryElement('thumbs');

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
    this.bindEvents();
  }

  initSlider() {
    const galleryThumbs = new Swiper(this.thumbs, {
      virtualTranslate: true,
    });

    this.slider = new Swiper(this.rowElement, {
      speed: 800,
      slidesPerView: 1,
      thumbs: {
        swiper: galleryThumbs,
        slideThumbActiveClass: 'active',
      },
    });
  }

  bindEvents() {
    this.slider.on('slideChange', (e) => {
      const zoomImage = document.querySelectorAll('.js-image-zoom.swiper-slide-active');
      zoomImage.forEach((item)=> {
       elevateImageZoom.init(item);
      })

    });
  }

  static init(elem) {
    new ModificationsSlider(elem);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-modifications-slider');
  slider.forEach(item => {
    ModificationsSlider.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-modifications-slider');
  slider.forEach(item => {
    ModificationsSlider.init(item);
  });
});


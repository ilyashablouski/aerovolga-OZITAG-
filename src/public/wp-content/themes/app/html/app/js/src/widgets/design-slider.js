class DesignSlider {
  queryElement(componentName) {
    const element = this.nodeElement.querySelector('.js-design-slider__' + componentName);

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
  }

  initSlider() {
    const galleryThumbs = new Swiper(this.thumbs, {
      slidesPerView: 5,
      spaceBetween: 5,
      navigation: {
        nextEl: '.thumbs-slide__next',
        prevEl: '.thumbs-slide__prev',
      },
      breakpoints: {
        767: {
          spaceBetween: 25,
          slidesPerView: 1,
        }
      }
    });

    this.slider = new Swiper(this.rowElement, {
      speed: 800,
      spaceBetween: 380,
      slidesPerView: 1,
      navigation: {
        nextEl: '.thumbs-slide__next',
        prevEl: '.thumbs-slide__prev',
      },
      thumbs: {
        swiper: galleryThumbs,
        slideThumbActiveClass: 'active',
      },
    });
  }

  static init(elem) {
    new DesignSlider(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-design-slider');
  slider.forEach(item => {
    DesignSlider.init(item);
  });
});

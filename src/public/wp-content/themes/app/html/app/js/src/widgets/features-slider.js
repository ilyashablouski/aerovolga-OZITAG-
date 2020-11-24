class FeaturesSlider {
  queryElement(componentName) {
    const element = this.nodeElement.querySelector('.js-features-slider__' + componentName);

    if (!element) {
      console.warn(`JS Certificate Slider - ${componentName} not found`);
    }

    return element;
  }

  queryElements(componentName) {
    const elements = this.nodeElement.querySelectorAll('.js-features-slider__' + componentName);

    if (elements.length === 0) {
      console.warn(`JS Certificate Slider - ${componentName} not found`);
    }
    return elements;
  }

  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.rowElement = this.queryElement('row');
    this.thumbs = this.queryElement('thumbs');
    this.textElementRows = this.queryElements('texts');


    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
    this.bindEvents();
    this.updateActiveText();
  }

  initSlider() {
    const galleryThumbs = new Swiper(this.thumbs, {
      slidesPerView: 'auto',
      breakpoints: {
        767: {
          slidesPerView: 1,
        },
        1024: {
          virtualTranslate: true,
        },
      },
    });

    this.slider = new Swiper(this.rowElement, {
      speed: 800,
      slidesPerView: 1,
      loopedSlides: 3,
      loop: true,
      slideToClickedSlide: true,
      centeredSlides: true,
      autoplay: {
        delay: 3000,
      },
      navigation: {
        nextEl: '.features__slider-next',
      },
      thumbs: {
        swiper: galleryThumbs,
        slideThumbActiveClass: 'active',
      },
      breakpoints: {
        767: {
          spaceBetween: 5,
        },
        1024: {
          spaceBetween: 300,
        },
      },
    });
  }

  getActiveSlideNumber() {
    return this.slider.realIndex + 1;
  }

  setVisibleTextElement(visibleIndex) {
    if (visibleIndex === 6) {
      visibleIndex = 2;
    }
    this.textElementRows.forEach(textElementRow => {
      textElementRow.children.forEach((item, _index) => {
        if (visibleIndex && _index === (visibleIndex - 1)) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }

  updateActiveText() {
    this.setVisibleTextElement(null);
    setTimeout(() => {
      this.setVisibleTextElement(this.getActiveSlideNumber());
    }, 300);
  }

  onSwiperSlideChange() {
    this.updateActiveText();
  }

  bindEvents() {
    this.slider.on('slideChange', this.onSwiperSlideChange.bind(this));
  }

  static init(elem) {
    new FeaturesSlider(elem);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-features-slider');
  slider.forEach(item => {
    FeaturesSlider.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-features-slider');
  slider.forEach(item => {
    FeaturesSlider.init(item);
  });
});

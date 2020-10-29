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
    console.log(this.thumbs, 'this.thumbs');
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
      virtualTranslate: true,
    });

    this.slider = new Swiper(this.rowElement, {
      speed: 800,
      spaceBetween: 380,
      slidesPerView: 1,
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
    });
  }

  getActiveSlideNumber() {
    return this.slider.activeIndex + 1;
  }

  setVisibleTextElement(visibleIndex) {
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

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-features-slider');
  slider.forEach(item => {
    FeaturesSlider.init(item);
  });
});

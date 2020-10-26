const configs = {
    speed: 800,
    observer: true,
    observeParents: true,
    spaceBetween: 380,
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 2000,
    },
    navigation: {
      nextEl: '.features__slider-next',
    },
};

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
    this.textElementRows = this.queryElements('texts');

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
    this.bindEvents();
    this.updateActiveText();
  }

  initSlider() {
    this.swiper = new Swiper(this.rowElement, configs);
  }

  getActiveSlideNumber() {
    return this.swiper.activeIndex + 1;
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
    this.swiper.on('slideChange', this.onSwiperSlideChange.bind(this));
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

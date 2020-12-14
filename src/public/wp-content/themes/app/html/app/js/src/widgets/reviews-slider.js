class ReviewsSlider {

  queryElements(componentName) {
    const element = this.nodeElement.querySelectorAll('.js-reviews-slider__' + componentName);
    if (!element) {
      console.warn(`JS Double Slider - ${componentName} not found`);
    }

    return element;
  }

  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.rowElement = this.queryElements('row');
    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.initSlider();
    this.updateCurrentButton();
    this.bindEvents();
  }

  initSlider() {
    this.rowElement.forEach((item) => {
      if (item.getAttribute('data-thumbs')) {
        this.sliderThumbs = new Swiper(item, {
          speed: 1000,
          spaceBetween: 40,
          slidesPerView: 1,
          navigation: {
            nextEl: '.thumbs-slide__next',
            prevEl: '.thumbs-slide__prev',
          },
        });

      } else {
        this.slider = new Swiper(item, {
          speed: 1000,
          spaceBetween: 380,
          slidesPerView: 1,
          navigation: {
            nextEl: '.thumbs-slide__next',
            prevEl: '.thumbs-slide__prev',
          },
        });
      }
    });
  }

  onNextClick() {
    this.sliderThumbs.slideNext();
    this.slider.slideNext();
  }

  onPrevClick() {
    this.sliderThumbs.slidePrev();
    this.slider.slidePrev();
  }

  getActiveSlideNumber() {
    return this.slider.activeIndex;
  }

  changeSlide(item, index, e) {
    const activeNumber = this.getActiveSlideNumber();
    if (activeNumber > index) {
      this.onPrevClick();
    } else if (activeNumber < index) {
      this.onNextClick();
    } else {
      e.preventDefault();
    }

  }

  updateCurrentButton() {
    this.nodeElement.querySelectorAll('.reviews__thumbs-slide').forEach((item, index) => {
      item.addEventListener('click', (e) => {
        this.changeSlide(item, index, e);
      });
    });
  }

  onSwiperSlideChange() {
    this.updateCurrentButton();
  }

  bindEvents() {
    this.slider.on('slideChange', this.onSwiperSlideChange.bind(this));
  }

  static init(elem) {
    new ReviewsSlider(elem);
  }
}

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-reviews-slider');
  slider.forEach(item => {
    ReviewsSlider.init(item);
  });
});

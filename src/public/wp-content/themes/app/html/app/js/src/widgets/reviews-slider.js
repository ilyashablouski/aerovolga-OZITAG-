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
    this.nextElement = this.nodeElement.querySelector('.thumbs-slide__next');
    this.prevElement = this.nodeElement.querySelector('.thumbs-slide__prev');
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
        });
      } else {
        this.slider = new Swiper(item, {
          speed: 1000,
          spaceBetween: 380,
          slidesPerView: 1,
        });
      }
    });
    this.disabledNavigation();
  }

  onNextClick() {
    this.sliderThumbs.slideNext();
    this.slider.slideNext();
  }

  onPrevClick() {
    this.sliderThumbs.slidePrev();
    this.slider.slidePrev();
  }

  disabledNavigation() {
    this.nextElement.classList.remove('disabled');
    this.prevElement.classList.remove('disabled');

    if (this.slider.isEnd && this.slider.isBeginning) {
      this.nextElement.classList.add('disabled');
      this.prevElement.classList.add('disabled');
      console.log(1);
    } else if (this.slider.isEnd) {
      this.nextElement.classList.add('disabled');
      this.prevElement.classList.remove('disabled');
      console.log(2);
    } else if (this.slider.isBeginning) {
      this.nextElement.classList.remove('disabled');
      this.prevElement.classList.add('disabled');
      console.log(3);
    } else {
      this.nextElement.classList.remove('disabled');
      this.prevElement.classList.remove('disabled');
      console.log(4);
    }
  }

  getActiveSlideNumber() {
    return this.slider.activeIndex;
  }

  changeSlide(item, index, e) {
    e.preventDefault();
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
    this.disabledNavigation();
  }

  bindEvents() {
    this.slider.on('slideChange', this.onSwiperSlideChange.bind(this));

    this.nextElement.addEventListener('click', () => this.onNextClick());
    this.prevElement.addEventListener('click', () => this.onPrevClick());
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

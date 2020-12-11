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
this.rowElement.forEach( (item)=> {
  if(item.getAttribute('data-thumbs')) {
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
})
  }

  goNext() {
    this.sliderThumbs.slideNext()
    this.slider.slideNext()
  }

  onNextClick(e) {
    e.preventDefault();
    this.goNext();
  }

  goPrev() {
    this.sliderThumbs.slidePrev();
    this.slider.slidePrev();
  }

  onPrevClick(e) {
    e.preventDefault();
    this.goPrev();
  }

  updateCurrentButton() {
    const activeElement =  this.nodeElement.querySelector('.reviews__thumbs-slide.swiper-slide-active');
    if (activeElement.nextElementSibling) {
      activeElement.nextElementSibling.addEventListener('click', this.onNextClick.bind(this));
    }
    if (activeElement.previousElementSibling) {
      activeElement.previousElementSibling.addEventListener('click', this.onPrevClick.bind(this));
    }
  }

  resetCurrentButton() {
    this.nodeElement.querySelectorAll('.reviews__thumbs-slide').forEach((item)=>{
      item.removeEventListener('click', ()=> {
      })
    })
  }

  onSwiperSlideChange() {
    this.resetCurrentButton()
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

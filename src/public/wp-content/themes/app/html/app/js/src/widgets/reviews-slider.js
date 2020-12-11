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
    this.slider = new Swiper(item, {
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
    this.slider.slideNext();
  }

  onNextClick(e) {
    e.preventDefault();
    this.goNext();
  }

  goPrev() {
    this.slider.slidePrev();
  }

  onPrevClick(e) {
    e.preventDefault();
    this.goPrev();
  }

  updateCurrentButton() {
    const nextElement =  this.nodeElement.querySelector('.reviews__thumbs-slide.swiper-slide-next');
    const prevElement =  this.nodeElement.querySelector('.reviews__thumbs-slide.swiper-slide-prev');
    if (nextElement) {
      nextElement.addEventListener('click', this.onNextClick.bind(this));
    }
    if (prevElement) {
      prevElement.addEventListener('click', this.onPrevClick.bind(this));
    }
  }

  resetCurrentButton() {
    this.nodeElement.querySelectorAll('.reviews__thumbs-slide').forEach((item)=>{
      item.removeEventListener('click', ()=> {
        return false;
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

/* document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelectorAll('.js-reviews-slider');
  slider.forEach(item => {
    ReviewsSlider.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-reviews-slider');
  slider.forEach(item => {
    ReviewsSlider.init(item);
  });
});

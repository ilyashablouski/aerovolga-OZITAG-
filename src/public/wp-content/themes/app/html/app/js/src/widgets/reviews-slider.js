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
  }

  initSlider() {
this.rowElement.forEach( (item)=> {
  console.log(item.getAttribute('data-thumbs'));
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

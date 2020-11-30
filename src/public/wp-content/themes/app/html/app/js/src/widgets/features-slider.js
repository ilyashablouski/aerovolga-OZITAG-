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
    this.setVisibleThumbs(this.getActiveSlideNumber());
    this.bindEvents();
    this.updateActiveText();
  }

  initSlider() {
    let menu = ['Сost of ownership', 'Composite fuselage', 'On land and at sea', 'Comfort'];

    this.slider = new Swiper(this.rowElement, {
      speed: 800,
      slidesPerView: 1,
      loopedSlides: 3,
      loop: true,
      slideToClickedSlide: true,
      centeredSlides: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.features__slider-next',
      },
      pagination: {
        el: this.thumbs,
        clickable: true,
        bulletActiveClass: 'active',
        dynamicBullets: true,
        progressbarOpposite: true,
        renderBullet: function(index, className) {
          return '<div class="' + className + ' features__thumbnail-item">' + '<span class="features__thumbnail-text">' + (menu[index]) + '</span>' + '</div>';
        },
      },
      breakpoints: {
        767: {
          spaceBetween: 5,
          pagination: {
            dynamicBullets: false,
          },
        },
        1024: {
          spaceBetween: 300,
          pagination: {
            dynamicBullets: false,

          },
        },
      },
    });
  }

  setVisibleThumbs(visibleIndex) {
    if (isMobileLayout()) {
      if (visibleIndex === 1) {
        this.thumbs.querySelectorAll('.swiper-pagination-bullet').forEach((item) => {
          item.style.left = '0';
        });
      } else if (visibleIndex === 2) {
        this.thumbs.querySelectorAll('.swiper-pagination-bullet').forEach((item) => {
          item.style.left = '-171px';
        });
      } else if (visibleIndex === 3) {
        this.thumbs.querySelectorAll('.swiper-pagination-bullet').forEach((item) => {
          item.style.left = '-352px';
        });
      } else {
        this.thumbs.querySelectorAll('.swiper-pagination-bullet').forEach((item) => {
          item.style.left = '-352px';
        });
      }
    }
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
    this.setVisibleTextElement(this.getActiveSlideNumber());
  }


  onSwiperSlideChange() {
    this.updateActiveText();
    this.setVisibleThumbs(this.getActiveSlideNumber());
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

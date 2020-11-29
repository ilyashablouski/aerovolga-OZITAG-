class FreeScrollSlider {

  constructor(node) {
    this.$node = node
    this.breakpoint = this.$node.dataset.breakpointValue || null;
    this.check = false;
    // console.log(this.breakpoint , 'this.breakpoint ');
    // console.log(this.$node, 'this.$node');

    this.initCertificateSlider();
  }

  initCertificateSlider() {
    this.updateCache();
    onResize(this.updateCache.bind(this));
  }

  initSlider() {
    this.slider = new Swiper(this.$node, {
      slidesPerView: 'auto',
      speed: 600,
      effect: "slide",
      spaceBetween: 17,
      slideToClickedSlide: true,
      freeMode: true,
      breakpoints: {
        768: {
          spaceBetween: 60,
        },
      },
    });

    this.check = true;
  }

  destroySwiper() {
    this.slider.destroy(true, true);
    this.check = false;
  }

  get checkBreakpoint() {
    switch (this.breakpoint) {
      case null:
        return true;
      case 'mobile':
        return isMobileLayout();
      case 'tablet':
        return isTabletLayout();
      case 'laptop':
        return isLaptopLayout();
      case 'desktop':
        return isDesktopLayout();
      default:
        return true;
    }
  }

  updateCache() {
    this.mayInit = this.checkBreakpoint;
    if (!this.mayInit) {
      if (!this.check) this.initSlider();
    } else {
      if (this.check) {
        this.destroySwiper();
      }
    }
  }

  static init(elem) {
    new FreeScrollSlider(elem);
  }
}


subscribeToEvent('initModules', () => {
  const slider = document.querySelectorAll('.js-free-scroll-slider');
  slider.forEach(item => {
    FreeScrollSlider.init(item);
  });
});

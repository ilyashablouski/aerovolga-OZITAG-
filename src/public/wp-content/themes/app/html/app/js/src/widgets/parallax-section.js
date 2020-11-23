class Parallax {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.initParallax();
    this.bindEvents();
  }

  initParallax() {
    this.scroll = new LocomotiveScroll({
      el: this.nodeElement,
      smooth: true,
    });
  }

  stopParallax() {
    const sectionScroll = document.querySelectorAll('.js-scroll-section');
    console.log(sectionScroll);
  }

  bindEvents() {
    window.addEventListener('scroll', this.stopParallax);
  }

  static init(elem) {
    new Parallax(elem);
  }
}

subscribeToEvent('initModules', () => {
  const parallax = document.querySelector('[data-scroll-container]');
  Parallax.init(parallax);
});

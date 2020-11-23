class Parallax {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;
    console.log(this.nodeElement);

    this.initParallax();

  }

  initParallax() {
    this.scroll = new LocomotiveScroll({
      el: this.nodeElement,
      smooth: true,
      stop: () => {

      },
    });
  }

  bindEvents() {

    this.scroll.stop();
  }

  static init(elem) {
    new Parallax(elem);
  }
}

subscribeToEvent('initModules', () => {
  const parallax = document.querySelector('[data-scroll-container]');
  Parallax.init(parallax);
});

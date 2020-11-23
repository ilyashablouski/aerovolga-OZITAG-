class Parallax {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.rellax = this.nodeElement.querySelector('.rellax');
    console.log(this.rellax);

    this.initParallax();
  }

  elemInViewport(elem) {
    const box = elem.getBoundingClientRect();
    const top = box.top;
    const bottom = box.bottom;
    const height = document.documentElement.clientHeight;
    const maxHeight = 0;
    return Math.min(height, bottom) - Math.max(0, top) >= maxHeight;
  }

  initParallax() {
    this.parallax = new Rellax(this.rellax);
  }

  destroyParallax() {
    if (!this.parallax) return;
    this.parallax.destroy();
  }

  static init(elem) {
    new Parallax(elem);
  }
}

subscribeToEvent('initModules', () => {
  const parallax = document.querySelectorAll('.js-parallax');
  parallax.forEach(item => {
    Parallax.init(item);
  });
});

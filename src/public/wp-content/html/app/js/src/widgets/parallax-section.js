class Parallax {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;
    console.log(this.nodeElement, 'this.nodeElement');

    this.image = this.nodeElement.querySelector('[data-parallax="img"]');

    gsap.registerPlugin(ScrollTrigger);

    this.initParallaxAnimations();
  }

  initParallaxAnimations() {
    gsap.from(this.image, {
      y: '-25%',
      ease: 'linear',
      duration: 2,
      scrollTrigger: {
        trigger: this.nodeElement,
        start: '-15% bottom',
        end: '70% 70%',
        scrub: true,
        toggleActions: 'restart none reverse reset',
      },
    });
    gsap.from(this.image, {
      opacity: 0,
      ease: 'linear',
      duration: 0.5,
      scrollTrigger: {
        trigger: this.nodeElement,
        start: '-15% 55%',
        end: '70% 100%',
        scrub: true,
        toggleActions: 'restart none reverse reset',
      },
    });
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

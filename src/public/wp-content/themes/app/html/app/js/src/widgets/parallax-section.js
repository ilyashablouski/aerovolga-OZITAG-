class Parallax {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;
    console.log(this.nodeElement, 'this.nodeElement');

    this.image = this.nodeElement.querySelector('[data-parallax="img"]');

    gsap.registerPlugin(ScrollTrigger);

    this.initParallaxAnimations();
  }

  initParallaxAnimations() {

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.nodeElement,
        start: '-20% bottom',
        end: '80% 40%',
        scrub: true,
        toggleActions: 'restart none reverse reset',
      },
    })
      .from(this.image, { y: '-15%', opacity: 0.3, ease: 'linear', duration: 2.5 });
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

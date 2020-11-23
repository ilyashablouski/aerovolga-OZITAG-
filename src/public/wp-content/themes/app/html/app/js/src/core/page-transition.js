class PageTransition {
  constructor() {
    this.loader = null;
  }

  in() {
    return new Promise((resolve) => {
      this.onAnimationEnd(() => {
        this.afterIn();
        resolve();
      });
      this.loader.classList.add('hide');
      document.body.classList.add('loaded');
    });
  }

  afterIn() {
    this.loader.style.display = 'none';
    this.loader.classList.remove('hide');
  }

  out() {
    return new Promise((resolve) => {
      this.onAnimationEnd(() => {
        this.afterOut();
        resolve();
      });
      this.loader.style.display = '';
      this.loader.classList.add('show');
      document.body.classList.remove('loaded');
    });
  }

  afterOut() {
    this.loader.classList.remove('show');
  }

  onAnimationEnd(callback) {
    const handler = ({ target }) => {
      if (!('animationEnd' in target.dataset)) return null;
      this.loader.removeEventListener(endEvents.animation, handler);
      callback();
    };
    this.loader.addEventListener(endEvents.animation, handler);
  }

  init() {
    const loader = document.querySelector('.js-page-transition');
    if (!loader) return null;
    this.loader = loader;
  }

  static createInstance () {
    return new PageTransition();
  }
}

const pageTransition = PageTransition.createInstance();

window.pageTransitionIn = pageTransition.in.bind(pageTransition);
window.pageTransitionOut = pageTransition.out.bind(pageTransition);

/* subscribeToEvent('initModules', () => {
  pageTransition.init();
}); */

pageTransition.init();
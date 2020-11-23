class App {
  constructor () {
    this.addEvents();
    this.initCore();
  }

  addEvents () {
    document.addEventListener('DOMContentLoaded', e => {
      this.initLibs();
      this.initModules();
    });

    document.documentElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    });
  }

  initLibs () {
    window.svg4everybody();
  }

  initModules () {
    disablingPreloader();
  }

  initCore() {
    barba.hooks.after(() => {
      /* App.dispatchEvent('initModules');
      App.dispatchEvent('pageEnter'); */
      return pageTransitionIn();
    });

    /* barba.hooks.afterLeave(({ next }) => {
      App.dispatchEvent('updatePageTheme', next);
      App.dispatchEvent('resetModules');
    });

    barba.hooks.beforeEnter(() => {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }); */

    barba.hooks.before(() => {
      // App.dispatchEvent('pageLeave');
      return pageTransitionOut();
    });

    barba.init({
      preventRunning: true,
    });
  }
}

const app = new App();

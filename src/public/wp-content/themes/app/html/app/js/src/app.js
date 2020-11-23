function leaveAnimation() {
  const tl = gsap.timeline();

  tl.to(".transition li", {
    duration: 0.5,
    scaleY: 1,
    transformOrigin: "bottom left",
    stagger: 0.2,
  });

  tl.to(".transition li", {
    duration: 0.5,
    scaleY: 0,
    transformOrigin: "bottom left",
    stagger: 0.1,
    delay: 0.1,
  });
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

class App {
  constructor () {
    App.observeEvents();
    App.domContentReady()
      .then(this.initCore.bind(this))
      .catch((err) => console.error(err))
      .then(this.initUI.bind(this))
      .catch((err) => console.error(err));

    this.addEvents();
  }

  static observeEvents() {
    observeEvent('initLibs');
    observeEvent('initModules');
    observeEvent('resetModules');
    observeEvent('updatePageTheme');
    observeEvent('pageEnter');
    observeEvent('pageLeave');
  }

  static domContentReady() {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  addEvents() {
    /* document.addEventListener('DOMContentLoaded', () => {
      this.initLibs();
      this.initModules();
    }); */

    subscribeToEvent('initModules', () => {
      this.initLibs();
      this.initModules();
    });

    document.documentElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault();
    });
  }

  initLibs() {
    window.svg4everybody();
  }

  initModules() {
    disablingPreloader();
  }

  initUI() {
    App.dispatchEvent('initLibs');
    App.dispatchEvent('initModules');
  }

  initCore() {
    barba.hooks.after(() => {
      App.dispatchEvent('initModules');
      App.dispatchEvent('pageEnter');
    });

    barba.hooks.afterLeave(({ next }) => {
      App.dispatchEvent('updatePageTheme', next);
      App.dispatchEvent('resetModules');
    });

    barba.hooks.beforeEnter(() => {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    });

    barba.hooks.before(() => {
      App.dispatchEvent('pageLeave');
    });

    barba.init({
      preventRunning: true,
      sync: true,

      transitions: [
        {
          async leave() {
            const done = this.async();
            leaveAnimation();
            await delay(1500);
            done();
          },

          async once() {
            const done = this.async();
            leaveAnimation();
            await delay(1500);
            done();
          },
        },
      ],
    });
  }

  static dispatchEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

const app = new App();

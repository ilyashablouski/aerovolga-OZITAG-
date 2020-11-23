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
          }
        },
      ],
    });
  }
}

const app = new App();

const timingFn = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};

class ScrollTo {
  constructor() {
    this.isOnScroll = false;
    this.onScrollId = null;
    this.trigger = null;
    this.target = null;

    onScroll(this.onScroll.bind(this));
  }

  onScroll() {
    if (!this.isOnScroll) return null;

    clearTimeout(this.onScrollId);
    this.onScrollId = setTimeout(() => {
      ScrollTo.endRespond(this.target, this.trigger);
      this.resetProps();
    }, 300);
  }

  startAnimation(target, trigger) {
    this.target = target;
    this.trigger = trigger;
    this.isOnScroll = true;

    ScrollTo.startRespond(target, trigger);

    let delta = -54;

    const parentSection = target.closest('[data-section]');
    if (parentSection) delta -= parentSection.clientTop + parseFloat(getComputedStyle(parentSection).paddingTop);

    if (isMobileLayout()) delta = 5;
    if ('noDelta' in target.dataset) delta = 0;

    const targetPos = target.getBoundingClientRect().top + delta;

    if ('scrollBehavior' in document.body.style) {
      return scrollBy({
        top: targetPos,
        behavior: 'smooth',
      });
    }

    const startPos = getScrollPos();
    const startTime = performance.now();
    const duration = 1200;

    raf(animation);

    function animation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const nextStep = timingFn(elapsedTime, startPos, targetPos, duration);

      window.scrollTo(0, nextStep);

      if (elapsedTime < duration) raf(animation);
    }
  }

  resetProps() {
    this.isOnScroll = false;
    this.target = null;
    this.trigger = null;
    this.onScrollId = null;
  }

  static startRespond(target, trigger) {
    const event = new CustomEvent('startScrollTo', {
      detail: { target, trigger },
    });
    document.dispatchEvent(event);
  }

  static endRespond(target, trigger) {
    const event = new CustomEvent('endScrollTo', {
      detail: { target, trigger },
    });
    document.dispatchEvent(event);
  }

  static createInstance() {
    return new ScrollTo();
  }
}

const scrollTo = ScrollTo.createInstance();
window.startScrollTo = scrollTo.startAnimation.bind(scrollTo);

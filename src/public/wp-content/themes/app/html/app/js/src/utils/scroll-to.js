class ScrollTo {
  static startAnimation(targetElem, noAnimate) {
    const header = document.querySelector('.js-header');
    let targetPos = ScrollTo.getOffset(targetElem);


    if (document.querySelector('.js-inner-header')) {
      targetPos -= 54;
    }

    if (noAnimate) {
      ScrollTo.respond(targetElem);
      return scrollTo(0, targetPos);
    }

    if ('scrollBehavior' in document.body.style) {
      ScrollTo.respond(targetElem);
      return scrollBy({
        top: targetPos,
        behavior: 'smooth',
      });
    }

    const duration = 1500;
    const startPos = getScrollPos();
    const startTime = performance.now();

    raf(animation);

    function animation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const nextStep = ScrollTo.timingFunction(
        elapsedTime, startPos, targetPos, duration,
      );

      scrollTo(0, nextStep);

      if (elapsedTime < duration) raf(animation);
      else ScrollTo.respond(targetElem);
    }
  }

  static timingFunction(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  static respond(targetElem) {
    const event = new CustomEvent(
      'endScroll', {
        detail: { targetElem },
      });

    document.dispatchEvent(event);
  }

  static getOffset(elem) {
    const offset = elem.getAttribute('data-offset');
    const offsetTablet = elem.getAttribute('data-offset-tablet');
    const offsetMobile = elem.getAttribute('data-offset-mobile');

    if (Layout.isMobileLayout()) {
      return offsetMobile ? elem.getBoundingClientRect().top - offsetMobile : elem.getBoundingClientRect().top;
    } else if(isTabletLayout()) {
      return offsetTablet ? elem.getBoundingClientRect().top - offsetTablet : elem.getBoundingClientRect().top;
    } else {
      return offset ? elem.getBoundingClientRect().top - offset : elem.getBoundingClientRect().top;
    }
  }
}

window.startScrollTo = ScrollTo.startAnimation;

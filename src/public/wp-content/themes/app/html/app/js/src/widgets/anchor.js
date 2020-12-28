class Anchor {
  constructor(item) {
    this.anchor = item;
    console.log(item, 'item');
    this.addEvents();
  }

  addEvents() {
    this.anchor.addEventListener('click', e => {
      this.to(e.target, e);
    });

  }

  getTarget(trigger) {
    const href = trigger.getAttribute('href');
    if (href && href[0] === '#') {
      return document.querySelector(href);
    } else if (trigger.dataset.target) {
      return document.querySelector(`${trigger.dataset.target}`);
    }
    return document.body;
  }

  to(trigger, e) {
    e.preventDefault();

    const target = this.getTarget(trigger);
    setTimeout(() => {
      startScrollTo(target);
    });
  }

  static init(elem) {
    new Anchor(elem);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const anchor = document.querySelectorAll('.js-scroll-to');
  anchor.forEach(item => {
    Anchor.init(item);
  });
}); */

subscribeToEvent('initModules', () => {
  const anchor = document.querySelectorAll('.js-scroll-to');
  anchor.forEach(item => {
    Anchor.init(item);
  });
});

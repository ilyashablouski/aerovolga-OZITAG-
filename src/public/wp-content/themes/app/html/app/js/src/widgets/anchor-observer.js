class AnchorObserver {
  constructor(elem) {
    this.elem = elem;

    this.observer = null;
    this.observerConfig = {};
    this.offset = {
      top: null,
      bottom: null,
    };

    if (!elem) return null;

    this.elem = elem;
    this.updateOffset();
    onResize(this.updateOffset.bind(this));
    this.indexingNavigation();
    this.initObserver();
  }

  initObserver() {
    this.observer = this.createObserver();
    const sections = document.querySelectorAll('[data-landmark]');
    sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  createObserver() {
    return new IntersectionObserver(this.checkEntries.bind(this), this.observerConfig);
  }

  checkEntries(entries) {
    for (let entry of entries) {
      const { target, intersectionRatio, boundingClientRect: cords } = entry;
      if (intersectionRatio > 0) {
        const currNavItem = this.getActiveNav();
        AnchorObserver.removeActiveNav(currNavItem);

        const { id } = target;

        const nextNavItem = this.getNavById(id);
        AnchorObserver.setActiveNav(nextNavItem);

        return null;
      } else if (cords.top > this.offset.top) {
        const { id } = target;
        const currNavItem = this.getNavById(id);
        AnchorObserver.removeActiveNav(currNavItem);

        const { index } = currNavItem.dataset;
        const prevNavItem = this.getNavByIndex(index - 1);
        AnchorObserver.setActiveNav(prevNavItem);

        return null;
      }
    }
  }

  getNavById(id) {
    return this.elem.querySelector(`[href="#${id}"]`);
  }

  getNavByIndex(index) {
    return this.elem.querySelector(`[data-index="${index}"]`);
  }

  getAllNavItems() {
    return this.elem.querySelectorAll('[href]');
  }

  getActiveNav() {
    return this.elem.querySelector(`[href].active`);
  }

  static setActiveNav(elem) {
    elem && elem.classList.add('active');
  }

  static removeActiveNav(elem) {
    elem && elem.classList.remove('active');
  }

  indexingNavigation() {
    const navItems = this.getAllNavItems();

    navItems.forEach((navItem, i) => {
      navItem.dataset.index = i;
    });
  }

  updateOffset() {
    const viewportHeight = document.documentElement.clientHeight;
    this.offset.top = viewportHeight * 10 / 1e2;
    this.offset.bottom = viewportHeight * 100 / 1e2;
  }

  static init(elem) {
    new AnchorObserver(elem);
  }
}

subscribeToEvent('initModules', () => {
  const anchors = document.querySelector('.js-anchors');
  AnchorObserver.init(anchors);
});

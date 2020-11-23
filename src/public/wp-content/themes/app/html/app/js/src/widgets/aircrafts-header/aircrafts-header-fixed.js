class AircraftsHeaderFixed extends Widget {
  constructor(node) {
    super(node, '.js-inner-header');

    this.$originalNode = node;

    this.$node = node.cloneNode(true);
    this.$node.classList.add('fixed');
    document.body.append(this.$node);

    this.busyEvents = false;

    let fixedTabsHeader = null;
    let originalTabsHeader = null;

    const $originalTabsHeader = this.$originalNode.querySelector('.js-inner-header-tabs');
    if ($originalTabsHeader) {
      originalTabsHeader = InnerHeaderTabs.init($originalTabsHeader);
    }

    const $fixedTabsHeader = this.$node.querySelector('.js-inner-header-tabs');
    if ($fixedTabsHeader) {
      fixedTabsHeader = InnerHeaderTabs.init($fixedTabsHeader);
    }

    if (fixedTabsHeader && originalTabsHeader) {
      originalTabsHeader.on('toggle-more', () => {
        if (this.busyEvents) return;
        this.busyEvents = true;
        fixedTabsHeader.toggleMore();
        setTimeout(() => this.busyEvents = false);
      });

      fixedTabsHeader.on('toggle-more', () => {
        if (this.busyEvents) return;
        this.busyEvents = true;
        originalTabsHeader.toggleMore();
        setTimeout(() => {
          this.busyEvents = false;
        });
      });
    }

    this.$node.querySelectorAll('.js-scroll-to').forEach(element => new ScrollToLink(element));

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.busy = false;
    this.animationCallback = null;

    this.nodeHeight = null;
    this.nodeOffset = null;
    this.lastScrollPos = 0;

    this.enabled = false;

    document.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });

    this.init();
  }

  updateNodeParams() {
    this.nodeHeight = this.$originalNode.offsetHeight;
    this.nodeOffset = this.$originalNode.getBoundingClientRect().top + getScrollPos();
  }


  build() {
    this.updateNodeParams();

    onScroll(this.onScroll);
    onResize(this.onResize);
  }

  destroy() {
    offScroll(this.onScroll);
    offResize(this.onResize);
  }

  onScroll() {
    const pageOffset = Math.min(document.body.offsetHeight - window.innerHeight, getScrollPos());

    if (pageOffset > (this.nodeOffset + this.nodeHeight)) {
      this.showHeader();
      this.enable();
    } else {
      this.hideHeader();
      this.disable();
    }

    if (this.busy) {
      this.setLastScrollPos(pageOffset);
      return false;
    }

    const isFixed = true;
    const isVisible = this.$node.classList.contains('visible');

    if (!isFixed) return;

    const direction = pageOffset >= this.lastScrollPos || pageOffset > (document.body.offsetHeight - window.innerHeight - 100) ? 'down' : 'up';

    if (direction === 'down') {
      if (isFixed && isVisible === false) {
        this.showHeader();
      }
    }

    this.setLastScrollPos(pageOffset);
  }

  onResize() {
    this.updateNodeParams();
  }

  setLastScrollPos(currScrollPos) {
    this.lastScrollPos = currScrollPos;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.removeAnimation();
    this.$node.classList.remove('animate');

    this.enabled = false;
  }

  hideHeader() {
    this.busy = true;

    this.onAnimationEnd(this.$node, () => {
    });

    this.$node.classList.remove('visible');
  }

  showHeader() {
    if (!this.enabled) {
      return;
    }

    this.busy = true;

    this.onAnimationEnd(this.$node, () => {
    });

    raf2x(() => {
      this.$node.querySelector('.inner-header__content').scrollLeft = 0;
      this.$node.classList.add('visible');
    });
  }

  onAnimationEnd(elem, callback) {
    this.animationCallback = ({target, currentTarget}) => {
      if (target !== currentTarget) return false;
      this.removeAnimation();
      callback();
    };
    elem.addEventListener(endEvents.transition, this.animationCallback);
  }

  removeAnimation() {
    this.$node.removeEventListener(endEvents.transition, this.animationCallback);
    this.animationCallback = null;
    this.busy = false;
  }

  static init(el) {
    new AircraftsHeaderFixed(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  AircraftsHeaderFixed.init(document.querySelector('.js-inner-header-fixed'));
});

window.InnerHeaderFixed = AircraftsHeaderFixed;

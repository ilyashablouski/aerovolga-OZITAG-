class FixedFooter {
  constructor(container) {
    this.container = container;
    this.initialize();
  }

  initialize() {
    this.handleResize();
    onResize(() => {
      this.handleResize();
    })
  }

  handleResize() {
    if (isMobileLayout()) {
      FixedFooter.setBodyOffset(0);
      return;
    }

    const containerHeight = this.getContainerHeight();
    console.log(containerHeight, 'containerHeight');
    FixedFooter.setBodyOffset(containerHeight);
  }

  getContainerHeight() {
    return this.container.offsetHeight;
  }

  static setBodyOffset(offset) {
    document.body.style.paddingBottom = `${offset}px`;
  }

  static createInstance(container) {
    return new FixedFooter(container);
  }
}

subscribeToEvent('initModules', () => {
  const container = document.querySelector('.js-footer');
  if (container) FixedFooter.createInstance(container);
});

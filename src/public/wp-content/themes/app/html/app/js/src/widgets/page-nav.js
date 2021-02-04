class PageNavPanel {
  constructor(elem) {
    this.header = elem;

    this.isFixedNav = false;

    this.onScroll();
    this.addEvents();
  }

  addEvents() {
    onScroll(this.onScroll.bind(this));
    onResize(function() {
      this.onScroll();
    }.bind(this));
  }

  onScroll() {
    if (getScrollPos() > 10) this.fixPageNav();
    else this.unfixPageNav();
  }

  fixPageNav() {
    if (this.isFixedNav) return null;
    this.isFixedNav = true;
    this.header.classList.add('fixed');
  }

  unfixPageNav() {
    if (!this.isFixedNav) return null;
    this.isFixedNav = false;
    this.header.classList.remove('fixed');
  }

  static init(elem) {
    new PageNavPanel(elem);
  }
}

subscribeToEvent('initModules', () => {
  const header = document.querySelectorAll('.js-page-header');
  if (!header) return null;
  header.forEach((item) => {
    PageNavPanel.init(item);
  });
});

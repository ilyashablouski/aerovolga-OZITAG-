class AircraftsHeaderMenu extends Widget {
  constructor(node) {
    super(node, '.js-aircrafts-header', 'bigTablet-desktop');

    this.$content = this.queryElement('.content');
    this.$container = this.queryElement('.container');
    this.$items = this.queryElements('.item');

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.$moreElement = null;
    this.$moreElementDropdown = null;
    this.moreElementWidth = null;
    this.moreElementVisible = false;

    this.widthMap = new Map();

    this.init();
  }

  build() {
    this.buildMore();

    onScroll(this.onScroll);
    onResize(this.onResize);

    this.$items.forEach(item => {
      this.widthMap.set(item, item.offsetWidth + parseInt(window.getComputedStyle(item).marginRight));
    });

    this.onResize();
    this.onScroll();
  }

  destroy() {
    offScroll(this.onScroll);
    offResize(this.onResize);

    this.hideMore();
    this.destroyMore();

    this.$items.forEach((item, index) => {
      item.classList.remove('item-on-more');
    });
  }

  onScroll() {

  }

  onResize() {
    this.$moreElementDropdown.innerHTML = '';
    const containerWidth = Math.ceil(this.$container.getBoundingClientRect().width + (this.moreElementVisible ? this.moreElementWidth : 0));
    let visibleMore = false;
    let width = 0;
    this.$items.forEach((item, index) => {
      const isLastElement = index === this.$items.length - 1;
      const itemWidth = this.widthMap.get(item);
      const containerWidth = Math.ceil(this.$container.getBoundingClientRect().width + (this.moreElementVisible ? this.moreElementWidth : 0));
      const maxWidth = isLastElement ? containerWidth : containerWidth - this.moreElementWidth;
      const check = (width + itemWidth) < maxWidth;
      if (check && !visibleMore) {
        width = width + itemWidth;
        item.classList.remove('item-on-more');
      } else {
        this.addItemToMore(item);
        item.classList.add('item-on-more');
        visibleMore = true;
      }
    });

    if (visibleMore) {
      this.showMore();
    } else {
      this.hideMore();
    }
  }

  showMore() {
    this.$moreElement.style.display = 'block';
    this.$content.classList.add('with-more');
    this.moreElementVisible = true;
  }

  hideMore() {
    this.$moreElement.style.display = 'none';
    this.$content.classList.remove('with-more');
    this.moreElementVisible = false;
  }

  buildMore() {
    const element = document.createElement('div');
    element.classList.add('aircrafts-header__more');

    const button = document.createElement('button');
    button.classList.add('aircrafts-header__more-action');

    const text = document.createElement('span');
    button.append(text);

    element.append(button);
    this.$content.append(element);

    const dropdown = document.createElement('ul');
    dropdown.classList.add('aircrafts-header__more-dropdown');

    element.appendChild(dropdown);

    this.$moreElement = element;
    this.$moreElementDropdown = dropdown;
    this.moreElementWidth = this.$moreElement.offsetWidth - 80;

    this.hideMore();
  }

  addItemToMore(item) {
    item.classList.add('item-on-more');

    const clonedElement = item.cloneNode(true);
    this.$moreElementDropdown.append(clonedElement);
  }

  destroyMore() {
    if (this.$moreElement) {
      this.$moreElement.remove();
    }
  }

  static init(el) {
    new AircraftsHeaderMenu(el);
  }
}

window.AircraftsHeaderMenu = AircraftsHeaderMenu;

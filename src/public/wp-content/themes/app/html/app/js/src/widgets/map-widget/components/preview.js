import { createObjectDetails } from '../helpers';

class Preview {
  constructor(node) {
    this.node = node;
    this.tab = this.getTab();
    this.popup = this.getPopup();

    this.isOpen = false;

    this.init();
  }

  init() {
    this.createEventListeners();
  }

  createEventListeners() {
    $(this.node).on('click', (e) => {
      const trigger = e.target.closest('[data-close]');
      if (trigger) this.closePreview();
    });
  }

  showObjectDetails(data) {
    switch (isTabletLayout()) {
      case false:
        this.renderDetails(this.tab, data);
        this.openPreview(this.tab);
        break;
      case true:
        this.renderDetails(this.popup, data);
        this.openPreview(this.popup);
        break;
    }
  }

  renderDetails(container, data) {
    const scrollerNode = container.querySelector('[data-scroller]');
    const contentWrapperNode = container.querySelector('[data-content]');

    scrollerNode.scrollTo(0, 0);
    contentWrapperNode.innerHTML = '';
    contentWrapperNode.appendChild(
      createObjectDetails(data),
    );
  }

  openPreview(target) {
    this.isOpen = true;
    target.classList.add('open');
  }

  closePreview() {
    this.isOpen = false;
    this.tab.classList.remove('open');
    this.popup.classList.remove('open');
  }

  getTab() {
    return this.node.querySelector('.js-preview-tab');
  }

  getPopup() {
    return this.node.querySelector('.js-preview-popup');
  }

  static createInstance(node) {
    return new Preview(node);
  }
}

export default Preview;

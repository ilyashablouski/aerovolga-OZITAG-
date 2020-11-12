import { dispatchEvent } from '../utils';

class Tabs {
  constructor(node) {
    this.node = node;
    this.activeTab = null;
    this.init();
  }

  init() {
    this.createEventListeners();
    this.getTabs().forEach(tab => {
      if (!this.isActiveTab(tab)) return;
      this.setActiveTab(tab.dataset.value);
    });
  }

  createEventListeners() {
    $(this.node).on('click', (e) => {
      const trigger = e.target.closest('[data-tab]');
      if (trigger) this.handleTabClick(trigger);
    });
  }

  handleTabClick(target) {
    this.setActiveTab(target.dataset.value);
    dispatchEvent('onTabsChange');
  }

  isActiveTab(tab) {
    return tab.classList.contains('active');
  }

  setActiveTab(value) {
    this.activeTab = value;
  }

  getTabs() {
    return this.node.querySelectorAll('[data-tab]');
  }

  static createInstance(node) {
    return new Tabs(node);
  }
}

export default Tabs;

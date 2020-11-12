import { dispatchEvent } from '../utils';

class Filters {
  constructor(node) {
    this.node = node;
    this.popupNode = this.getPopup();
    this.options = {};
    this.init();
  }

  init() {
    this.createEventListeners();
    this.getFields().forEach(field => {
      this.updateFieldState(field);
    });
  }

  createEventListeners() {
    $(this.node).on('click', (e) => {
      const trigger = e.target.closest('[data-more],[data-close]');
      if (trigger) this.handleFiltersClick(trigger);
    });

    $(this.node).on('change', (e) => {
      const trigger = e.target.closest('[data-select],[data-checkbox]');
      if (trigger) this.handleFiltersChange(trigger);
    });
  }

  updateFieldState(target) {
    switch (true) {
      case 'select' in target.dataset:
        this.handleSelectChange(target);
        break;
      case 'checkbox' in target.dataset:
        this.handleCheckboxChange(target);
        break;
    }
  }

  handleFiltersChange(target) {
    this.updateFieldState(target);
    dispatchEvent('onFiltersChange');
  }

  handleSelectChange(target) {
    const { selectedIndex, options } = target;
    const selectedOption = options[selectedIndex];

    this.setOption(target.name, target.value);
    this.getFieldsByName(target.name).forEach(select => {
      $(select).val(selectedOption.value);
      $(select).trigger('change.select2');
    });
  }

  handleCheckboxChange(target) {
    if (!target.checked) this.removeOption(target.name);
    else this.setOption(target.name, target.value);

    this.getFieldsByName(target.name).forEach(checkbox => {
      checkbox.checked = target.checked;
    });
  }

  getFields() {
    return this.node.querySelectorAll('[data-checkbox],[data-select]');
  }

  getFieldsByName(name) {
    return this.node.querySelectorAll(`[name="${name}"]`);
  }

  setOption(name, value) {
    this.options[name] = value;
  }

  removeOption(name) {
    delete this.options[name];
  }

  handleFiltersClick(target) {
    switch (true) {
      case 'more' in target.dataset:
        this.openPopup();
        break;
      case 'close' in target.dataset:
        this.closePopup();
        break;
    }
  }

  openPopup() {
    this.popupNode.classList.add('open');
  }

  closePopup() {
    this.popupNode.classList.remove('open');
  }

  getPopup() {
    return document.querySelector('.js-filters-popup');
  }

  static createInstance(node) {
    return new Filters(node);
  }
}

export default Filters;

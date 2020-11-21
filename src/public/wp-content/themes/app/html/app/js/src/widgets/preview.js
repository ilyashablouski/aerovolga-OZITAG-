class Preview {
  constructor(item) {
    this.preview = item;
    this.addEvents();
  }

  addEvents() {
    this.preview.addEventListener('mouseenter', () => {
      if (isTabletLayout()) return;

      const container = this.preview.closest('.js-previews');
      const currActive = container.querySelector('.active');

      if (currActive) {
        Preview.removeActive(currActive);
      }

      Preview.setActive(this.preview);
    });
  }

  static setActive(elem) {
    elem.classList.add('active');
  }

  static removeActive(elem) {
    elem.classList.remove('active');
  }

  static isActive(elem) {
    elem.classList.contains('active');
  }

  static init(elem) {
    new Preview(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-preview').forEach(node => {
    Preview.init(node);
  });
});

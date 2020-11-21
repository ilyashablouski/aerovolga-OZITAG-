class Previews {
  constructor(container, previewList) {
    this.container = container;
    this.previewList = previewList;

    this.initialize();
  }

  initialize() {
    Previews.setActive(this.previewList[0]);
    this.createEventListeners();
  }

  createEventListeners() {
    this.previewList.forEach((preview) => {
      preview.addEventListener('mouseenter', () => {
        if (!isLaptopLayout()) this.handlePreviewHover(preview);
      });
    });
  }

  handlePreviewHover(preview) {
    const currActive = this.container.querySelector('.active');
    if (currActive) Previews.removeActive(currActive);

    Previews.setActive(preview);
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
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-previews').forEach(node => {
    const previewList = node.querySelectorAll('.js-preview');
    if (!previewList.length) return;

    new Previews(node, previewList);
  });
});

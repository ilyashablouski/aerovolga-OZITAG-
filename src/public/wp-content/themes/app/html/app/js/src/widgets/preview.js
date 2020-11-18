class Preview {
  constructor(item) {
    this.preview = item;
    this.addEvents();
  }

  addEvents() {
    if(window.innerWidth > 1023) {
      this.preview.addEventListener('mouseover', () => {
        if (this.preview.classList.contains('active')) {
          return;
        } else {
          const container = this.preview.closest('.js-previews');
          const currActive = container.querySelector('.active');

          if (currActive) {
            currActive.classList.remove('active');
          }

          this.setActive(this.preview);
        }
      });
    }
  }

  setActive(elem) {
    elem.classList.add('active');
  }

  removeActive(elem) {
    elem.classList.remove('active');
  }

  static init(elem) {
    new Preview(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const preview = document.querySelectorAll('.js-preview');
  preview.forEach(item => {
    Preview.init(item);
  });
});

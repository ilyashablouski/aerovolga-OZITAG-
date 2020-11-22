class Accord {
  constructor(item) {
    this.accord = item;
    this.addEvents();
  }

  addEvents() {
    this.accord.querySelector('.accordion__top').addEventListener('click', () => {
      if (this.accord.classList.contains('active')) {
        this.removeActive(this.accord);
      } else {
        const container = this.accord.closest('.js-accords');
        const currActive = container.querySelector('.js-accord.active');

        if (currActive) {
          this.removeActive(currActive);
        }
        this.setActive(this.accord);
      }
    });
  }

  setActive(elem) {
    elem.classList.add('active');
    elem.querySelector('.accordion__description').style.maxHeight = elem.querySelector('.accordion__description-wrapper').scrollHeight + 'px';

    // setTimeout(() => {
    //   elem.querySelector('.accordion__description').style.overflow = 'visible';
    // }, 350);
  }

  removeActive(elem) {
    elem.classList.remove('active');
    elem.querySelector('.accordion__description').style.maxHeight = '0px';

    // elem.querySelector('.accordion__description').style.overflow = 'hidden';
  }

  static init(elem) {
    new Accord(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accords = document.querySelectorAll('.js-accord');
  accords.forEach(item => {
    Accord.init(item);
  });
});

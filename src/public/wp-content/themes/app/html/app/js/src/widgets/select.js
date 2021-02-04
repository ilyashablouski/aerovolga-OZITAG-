class Select {
  constructor(item) {
    this.select = item;
    this.selectTitle = this.select.querySelector('.form-select__select-title');
    this.selectLabels = this.select.querySelectorAll('.form-select__select-label');

    this.addEvents();
  }

  addEvents() {
    this.selectTitle.addEventListener('click', () => {
      if ('active' ===  this.select.getAttribute('data-state')) {
        this.select.setAttribute('data-state', '');
      } else {
        this.select.setAttribute('data-state', 'active');
      }
    });

    for (let i = 0; i < this.selectLabels.length; i++) {
      this.selectLabels[i].addEventListener('click', (evt) => {
        this.selectTitle.textContent = evt.target.textContent;
        this.select.setAttribute('data-state', '');
      });
    }
  }

  static init(elem) {
    new Select(elem);
  }
}

subscribeToEvent('initModules', () => {
  const select = document.querySelectorAll('.js-select');
  select.forEach(item => {
    Select.init(item);
  });
});

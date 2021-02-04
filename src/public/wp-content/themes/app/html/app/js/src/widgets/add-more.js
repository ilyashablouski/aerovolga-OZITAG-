class AddMore extends Widget {
  constructor(node) {
    super(node, '.js-copy');

    this.$row = this.queryElement('.row');
    this.$addButton = this.$node.querySelector('.js-add-btn');

    this.init();
  }

  events(e) {
    e.preventDefault();
    const newRow = this.$row.cloneNode(true);

    this.$row.insertAdjacentElement('afterend', newRow);
  }

  toggle() {
    this.$addButton.addEventListener('click', this.events.bind(this));
  }

  init() {
    this.toggle();
  }

  static setActive(elem) {
    elem.classList.add('active');
  }
}

subscribeToEvent('initModules', () => {
  const containers = document.querySelectorAll('.js-copy');
  containers.forEach(item => {
    new AddMore(item);
  });
});

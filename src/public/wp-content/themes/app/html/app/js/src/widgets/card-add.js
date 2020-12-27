class CardAdd extends Widget {
  constructor(node) {
    super(node, '.js-card-add');

    this.$list = this.queryElements('.card');
    this.$addButton = this.queryElement('.btn');
    this.start = null;
    this.end = null;
    this.step = 10;

    this.init();
  }

  events() {
    if (this.checkCondition()) return;

    this.start === null ?
      this.step < this.$list.length ?
        this.end = this.step :
        this.end = this.$list.length :
      this.end < this.$list.length ?
        this.end = this.start + this.step :
        this.end = this.$list.length;

    for (
      this.start === null ?
        this.start = 0 :
        this.start;
      this.start < this.end;
      this.start++
    ) {
      CardAdd.setActive(this.$list[this.start]);
    }

    this.end = this.start + this.step;

    if (this.checkCondition()) this.$addButton.remove();
  }

  toggle() {
    this.$addButton.addEventListener('click', this.events.bind(this));
  }

  checkCondition() {
    return this.$list.length === this.start;
  }

  init() {
    this.checkCondition();
    this.events();
    this.toggle();
  }

  static setActive(elem) {
    elem.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.querySelectorAll('.js-card-add');
  newsContainer.forEach(item => {
    new CardAdd(item);
  });
});

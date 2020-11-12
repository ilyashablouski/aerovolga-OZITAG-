class AircraftsHeader extends Widget {
  constructor(node) {
    super(node, '.js-aircrafts-header');

    AircraftsHeaderMenu.init(node);
  }

  static init(el) {
    el && new AircraftsHeader(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  AircraftsHeader.init(document.querySelector('.js-aircrafts-header'));
});

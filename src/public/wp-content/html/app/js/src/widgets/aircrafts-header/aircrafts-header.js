class AircraftsHeader extends Widget {
  constructor(node) {
    super(node, '.js-aircrafts-header');

    console.log(this.$node);
    AircraftsHeaderMenu.init(node);
    // AircraftsHeaderFixed.init(this.$node);
  }

  static init(el) {
    el && new AircraftsHeader(el);
  }
}

// document.addEventListener('DOMContentLoaded', () => {
//   AircraftsHeader.init(document.querySelector('.js-aircrafts-header'));
// });

subscribeToEvent('initModules', () => {
  AircraftsHeader.init(document.querySelector('.js-aircrafts-header'));
});

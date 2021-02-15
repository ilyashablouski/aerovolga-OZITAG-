class AircraftMap extends Widget{
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
  }


  initGoogleMaps() {

  }

build() {
  console.log($node + 'Initialized');
}

  static init (element) {
    new AircraftMap(element);
  }
}

subscribeToEvent('initModules', () => {
  const select = document.querySelectorAll('.js-aircraft-map');
  select.forEach(item => {
    AircraftMap.init(item);
  });
});

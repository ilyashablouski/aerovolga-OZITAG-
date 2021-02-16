class AircraftMap extends Widget{
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.init();
  }


  initGoogleMaps() {
    const loader = new mapApiLoader({
      apiKey: "AIzaSyDN2HnVw-m5nBlwzRTJnNF0hCm-fznR1DM",
      version: "weekly",
    });
    loader.load().then(() => {
      const map = new google.maps.Map(this.mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
    console.log('Google map has been initialized');
  }

build() {
  console.log(this.$node + 'Initialized');
  this.initGoogleMaps();
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

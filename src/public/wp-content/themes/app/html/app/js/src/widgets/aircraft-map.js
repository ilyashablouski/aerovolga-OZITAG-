class AircraftMap extends Widget{
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.init();
  }


  initGoogleMaps() {
    // Api Key from data attribute
    const mapApiKey = this.mapElement.dataset.apiKey;

    const loader = new mapApiLoader({
      apiKey: mapApiKey ,
      version: "weekly",
    });
    loader.load().then(() => {
      const myLatLng = new google.maps.LatLng(46.573023, 7.138861);

      // Create map instance
      const map = new google.maps.Map(this.mapElement, {
        center: myLatLng,
        zoom: 5,
      });

      // Place a draggable marker on the map
      const marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable:true,
        title:"Drag me!"
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

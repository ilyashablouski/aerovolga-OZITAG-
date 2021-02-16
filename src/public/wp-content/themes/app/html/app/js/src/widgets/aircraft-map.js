class AircraftMap extends Widget{
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.mapLegend = document.querySelector('.js-aircraft-map__legend');
    this.mapSelect = document.querySelector('.js-aircraft-map__select');

    this.mapDataArray = [
      {id: 0, info: {}},
      {id: 1, info: {}},
      {id: 2, info: {}},
      {id: 3, info: {stringLegend: `<div class="map-legend">
          <div class="map-legend__left">
            <span class="map-legend__pointer" style="background:#0035AD"></span>
          </div>
          <div class="map-legend__right">
            <div class="map-legend__title">Min range</div>
            <div class="map-legend__description">8 passengers and luggage</div>
          </div>
        </div>
        <div class="map-legend">
          <div class="map-legend__left">
            <span class="map-legend__pointer" style="background:#980000"></span>
          </div>
          <div class="map-legend__right">
            <div class="map-legend__title">Max range</div>
            <div class="map-legend__description">without passengers and luggage</div>
          </div>
        </div>`}},
      {id: 4, info: {}},
      {id: 5, info: {}},
      {id: 6, info: {}},
    ];

    this.onChange = this.onChange.bind(this);
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

  // Change event for select
  onChange (e) {
    if (e.target.value) {
    const mapDataArrayItem = this.mapDataArray?.filter((mapDataItem) => {
        return String(mapDataItem.id) === e.target.value;
      });
    // Legend data object
    const legendDataObject = mapDataArrayItem[0].info;

    this.setLegendData(legendDataObject);
    }
  }

  setLegendData(data) {
    if (data.stringLegend) {
      this.mapLegend.innerHTML = data.stringLegend;
    } else {
      this.mapLegend.innerHTML = `Custom legend`;
    }
  }


build() {
  console.log(this.$node + 'Initialized');
  this.initGoogleMaps();

  $(this.mapSelect).select2().on('change',this.onChange);
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

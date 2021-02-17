class AircraftMap extends Widget {
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.mapLegend = document.querySelector('.js-aircraft-map__legend');
    this.mapSelect = document.querySelector('.js-aircraft-map__select');
    this.mapInstance;

    this.state = {
      legend: null,
      latitude: 46.573023,
      langitude: 7.138861,
      circles: [
        { center: { lat: 46.573023, lng: 7.138861 }, radius: 600, color: 'blue' },
        { center: { lat: 46.573023, lng: 7.138861 }, radius: 700, color: 'red' },
      ],
    };

    this.mapPlainArray = [
      { id: 0, info: {} },
      { id: 1, info: {} },
      { id: 2, info: {} },
      {
        id: 3, info: {
          legend: `<div class='map-legend'>
          <div class='map-legend__left'>
          <span class='map-legend__pointer' style='background:#0035AD'></span>
          </div>
          <div class='map-legend__right'>
          <div class='map-legend__title'>Min range</div>
          <div class='map-legend__description'>8 passengers and luggage</div>
          </div>
          </div>
          <div class='map-legend'>
          <div class='map-legend__left'>
          <span class='map-legend__pointer' style='background:#980000'></span>
          </div>
          <div class='map-legend__right'>
          <div class='map-legend__title'>Max range</div>
          <div class='map-legend__description'>without passengers and luggage</div>
          </div>
          </div>`,
          circles: [{ center: { lat: 41.878, lng: -87.629 }, radius: 100, color: 'blue' }, {
            center: {
              lat: 41.878,
              lng: -87.629,
            }, radius: 200, color: 'red',
          }],
        },
      },
      { id: 4, info: {} },
      { id: 5, info: {} },
      { id: 6, info: {} },
    ];

    this.onChange = this.onChange.bind(this);
    this.init();
  }

  initGoogleMaps() {
    // Api Key from data attribute
    const mapApiKey = this.mapElement.dataset.apiKey;

    const loader = new mapApiLoader({
      apiKey: mapApiKey,
      version: 'weekly',
    });
    loader.load().then(() => {
      const myLatLng = new google.maps.LatLng(this.state.latitude, this.state.langitude);

      // Create map instance
      this.mapInstance = new google.maps.Map(this.mapElement, {
        center: myLatLng,
        zoom: 5,
      });

      // Place a draggable marker on the map
      const marker = new google.maps.Marker({
        position: myLatLng,
        map: this.mapInstance,
        draggable: true,
        title: 'Drag me!',
      });

      // First draw circles with map
      this.drawCircles(this.state.circles, this.mapInstance);

    });

    console.log('Google map has been initialized');
  }

  drawCircles(circleDataArray, map) {
    for (const circleDataArrayItem of circleDataArray) {
      new google.maps.Circle({
        strokeColor: circleDataArrayItem.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'transparent',
        fillOpacity: 0.35,
        map:map,
        center: circleDataArrayItem.center,
        radius: circleDataArrayItem.radius * (10 ** 3),
      });
    }
  }

  // Change event for select
  onChange(e) {
    if (e.target.value) {
      const mapDataArrayItem = this.mapDataArray?.filter((mapDataItem) => {
        return String(mapDataItem.id) === e.target.value;
      });

      this.state = mapDataArrayItem[0].info;

      this.renderMapData(this.state);
    }
  }


  renderMapData(data) {
    if (data.legend) {
      this.mapLegend.innerHTML = data.legend;
    }

    if (data.circles) {
      this.drawCircles(data.circles);
    }
  }


  build() {
    console.log(this.$node + 'Initialized');
    this.initGoogleMaps();

    $(this.mapSelect).select2().on('change', this.onChange);
  }

  static init(element) {
    new AircraftMap(element);
  }
}

subscribeToEvent('initModules', () => {
  const select = document.querySelectorAll('.js-aircraft-map');
  select.forEach(item => {
    AircraftMap.init(item);
  });
});

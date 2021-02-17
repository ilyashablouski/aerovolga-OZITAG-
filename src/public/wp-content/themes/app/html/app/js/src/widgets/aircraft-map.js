// <div className='map-legend'>
//   <div className='map-legend__left'>
//     <span className='map-legend__pointer' style='background:#0035AD'></span>
//   </div>
//   <div className='map-legend__right'>
//     <div className='map-legend__title'>Min range</div>
//     <div className='map-legend__description'>8 passengers and luggage</div>
//   </div>
// </div>
// <div className='map-legend'>
//   <div className='map-legend__left'>
//     <span className='map-legend__pointer' style='background:#980000'></span>
//   </div>
//   <div className='map-legend__right'>
//     <div className='map-legend__title'>Max range</div>
//     <div className='map-legend__description'>without passengers and luggage</div>
//   </div>
// </div>

class AircraftMap extends Widget {
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.mapLegend = document.querySelector('.js-aircraft-map__legend');
    this.mapSelect = document.querySelector('.js-aircraft-map__select');
    this.mapInstance;

    this.state = {
      legend: null,
      center: { lat: 46.573023, lng: 7.138861 },
      circles: [{ radius: 600, color: 'blue' },{radius: 700, color: 'red' }],
    };

    this.mapPlainDataArray = [
      {id: 0, info: {
          legend: 'legend1',
          center: { lat: 50, lng: 10 },
          circles: [{ radius: 600, color: 'yellow' },{radius: 700, color: 'green' }]
        },
      },
      { id: 1, info: {
          legend: 'legend2',
          center: { lat: 30, lng: 6 },
          circles: [{ radius: 600, color: 'black' },{radius: 700, color: 'white' }]
        } },
      { id: 2, info: {} },
      { id: 3, info: {} },
      { id: 4, info: {} },
      { id: 5, info: {} },
      { id: 6, info: {} },
    ];

    this.onChange = this.onChange.bind(this);
    this.init();
  }

  initGoogleMaps(mapData) {

    // Api Key from data attribute
    const mapApiKey = this.mapElement.dataset.apiKey;

    const loader = new mapApiLoader({
      apiKey: mapApiKey,
      version: 'weekly',
    });
    loader.load().then(() => {
      const myLatLng = new google.maps.LatLng(mapData.center);

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
      });

      // First draw circles with map
      this.drawCircles(mapData.center, mapData.circles);
    });

    console.log('Google map has been initialized');
  }

  drawCircles(markCoordinate, circleDataArray) {
    for (const circleDataArrayItem of circleDataArray) {
      new google.maps.Circle({
        strokeColor: circleDataArrayItem.color,
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: 'transparent',
        fillOpacity: 0.35,
        map: this.mapInstance,
        center: markCoordinate,
        radius: circleDataArrayItem.radius * (10 ** 3),
      });
    }
  }

  // updateMap(, myLatLng) {
  //   marker.setPosition(myLatLng);
  //   map.setCenter(myLatLng);
  //
  // }

  // Change event for select
  onChange(e) {
    if (e.target.value) {
      const mapPlainDataArrayItem = this.mapPlainDataArray?.filter((mapPlainItem) => {
        return String(mapPlainItem.id) === e.target.value;
      });

      this.state = mapPlainDataArrayItem[0].info;
      this.renderMapData(this.state);
    }
  }


  renderMapData(data) {
    if (data.legend) {
      this.mapLegend.innerHTML = data.legend;
    } else {
      this.mapLegend.innerHTML = 'Default legend';
    }

    if (data.circles) {
      this.drawCircles(data.center, data.circles);
    }
  }


  build() {
    console.log(this.$node + 'Initialized');
    this.initGoogleMaps(this.state);

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

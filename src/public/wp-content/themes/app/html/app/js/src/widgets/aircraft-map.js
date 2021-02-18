class AircraftMap extends Widget {
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.mapLegend = document.querySelector('.js-aircraft-map__legend');
    this.mapSelect = document.querySelector('.js-aircraft-map__select');
    this.mapInstance;
    this.mapMarker;
    this.circlesArray = [];
    this.defaultMarkCoordinate = { lat: 46.573023, lng: 7.138861 };
    this.mapPlainDataArray = window.mapPlainDataArray;

    this.state = {
      legend: null,
      circles: [{ radius: 600, color: '0014ff' }, { radius: 700, color: 'ff0000' }],
    };

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
      const myLatLng = new google.maps.LatLng(this.defaultMarkCoordinate);

      // Styles for map
      const stylesMapOptions = [
        {
          "stylers": [
            {
              "saturation": -100
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.place_of_worship",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.place_of_worship",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "water",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "saturation": 50
            },
            {
              "gamma": 0
            },
            {
              "hue": "#50a5d1"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#333333"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text",
          "stylers": [
            {
              "weight": 0.5
            },
            {
              "color": "#333333"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.icon",
          "stylers": [
            {
              "gamma": 1
            },
            {
              "saturation": 50
            }
          ]
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#858585' }]
        }
      ];


      // Create map instance
      this.mapInstance = new google.maps.Map(this.mapElement, {
        center: myLatLng,
        zoom: 5,
        controlSize:32,
        mapTypeControl:false,
        streetViewControl:false,
        rotateControl:false,
        fullscreenControl:false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        styles:stylesMapOptions
      });

      // Place a draggable marker on the map
      this.mapMarker = new google.maps.Marker({
        position: myLatLng,
        map: this.mapInstance,
        icon: '../assets/images/map-mark.svg',
        draggable: true,
      });

      // First draw circles with map
      this.drawCircles(myLatLng, mapData.circles);
    });

    console.log('Google map has been initialized');
  }

  drawCircles(markCoordinate, circleDataArray) {
    let circles = this.circlesArray;

    for (const circleDataArrayItem of circleDataArray) {
      const circle = new google.maps.Circle({
        strokeColor: `#${circleDataArrayItem.color}`,
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: 'transparent',
        fillOpacity: 0.35,
        map: this.mapInstance,
        center: markCoordinate,
        radius: circleDataArrayItem.radius * (10 ** 3),
      });

      circle.bindTo("center", this.mapMarker, "position");
      circles.push(circle);
    }
  }

  removeAllCircles() {
    for (const circlesArrayElement of this.circlesArray) {
      circlesArrayElement.setMap(null);
    }
    this.circlesArray = [];
  }

  // Change event for select
  onChange(e) {
    if (e.target.value) {
      const mapPlainDataArrayItem = this.mapPlainDataArray?.filter((mapPlainItem) => {
        return String(mapPlainItem.id) === e.target.value;
      });

      this.state = mapPlainDataArrayItem[0].info;
      this.removeAllCircles();
      this.renderMapData(this.state);
    }
  }


  renderMapData(data) {
    if (data.legend) {
      this.mapLegend.innerHTML = data.legend;
    }

    if (data.circles) {
      this.drawCircles(this.defaultMarkCoordinate, data.circles);
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

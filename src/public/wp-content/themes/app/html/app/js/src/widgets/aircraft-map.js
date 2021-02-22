class AircraftMap extends Widget {
  constructor(nodeElement) {
    super(nodeElement, 'js-aircraft-map');
    this.mapElement = document.querySelector('.js-aircraft-map__api');
    this.mapLegend = document.querySelector('.js-aircraft-map__legend');
    this.mapSelect = document.querySelector('.js-aircraft-map__select');
    this.mapInstance;
    this.mapMarker;
    this.circlesArrayBuffer = [];
    this.defaultMarkCoordinate = { lat: 46.573023, lng: 7.138861 };
    this.mapDataArray = window.mapDataArray;

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
      const myLatLng = new google.maps.LatLng(this.defaultMarkCoordinate);

      // Styles for map
      const stylesMapOptions = [
        {
          'stylers': [
            {
              'saturation': -100,
            },
            {
              'gamma': 1,
            },
          ],
        },
        {
          'elementType': 'labels.text.stroke',
          'stylers': [
            {
              'visibility': 'off',
            },
          ],
        },
        {
          'featureType': 'poi.business',
          'elementType': 'labels.text',
          'stylers': [
            {
              'visibility': 'off',
            },
          ],
        },
        {
          'featureType': 'poi.business',
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off',
            },
          ],
        },
        {
          'featureType': 'poi.place_of_worship',
          'elementType': 'labels.text',
          'stylers': [
            {
              'visibility': 'off',
            },
          ],
        },
        {
          'featureType': 'poi.place_of_worship',
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off',
            },
          ],
        },
        {
          'featureType': 'road',
          'elementType': 'geometry',
          'stylers': [
            {
              'visibility': 'simplified',
            },
          ],
        },
        {
          'featureType': 'water',
          'stylers': [
            {
              'visibility': 'on',
            },
            {
              'saturation': 50,
            },
            {
              'gamma': 0,
            },
            {
              'hue': '#50a5d1',
            },
          ],
        },
        {
          'featureType': 'administrative.neighborhood',
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'color': '#333333',
            },
          ],
        },
        {
          'featureType': 'road.local',
          'elementType': 'labels.text',
          'stylers': [
            {
              'weight': 0.5,
            },
            {
              'color': '#333333',
            },
          ],
        },
        {
          'featureType': 'transit.station',
          'elementType': 'labels.icon',
          'stylers': [
            {
              'gamma': 1,
            },
            {
              'saturation': 50,
            },
          ],
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#858585' }],
        },
      ];

      // Create map instance
      this.mapInstance = new google.maps.Map(this.mapElement, {
        center: myLatLng,
        zoom: 5,
        controlSize: 32,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
        },
        styles: stylesMapOptions,
      });

      // Place a draggable marker on the map
      this.mapMarker = new google.maps.Marker({
        position: myLatLng,
        map: this.mapInstance,
        icon: '../assets/images/map-mark.svg',
        draggable: true,
      });

      // Init first draw circles with legend for default option
      this.triggerOnChange();
    });

    console.log('Google map has been initialized');
  }

  triggerOnChange() {
    $(this.mapSelect).select2().trigger('change', this.onChange);
  }

  drawCircles(markCoordinate, dataArray) {
    let circles = this.circlesArrayBuffer;

    for (const dataArrayItem of dataArray) {
      const circle = new google.maps.Circle({
        strokeColor: dataArrayItem.color,
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: 'transparent',
        fillOpacity: 0.35,
        map: this.mapInstance,
        center: markCoordinate,
        radius: dataArrayItem.radius * (10 ** 3),
      });

      circle.bindTo('center', this.mapMarker, 'position');
      circles.push(circle);
    }
  }

  removeAllCircles() {
    for (const circlesArrayElement of this.circlesArrayBuffer) {
      circlesArrayElement.setMap(null);
    }
    this.circlesArrayBuffer = [];
  }

  drawLegends(dataArray) {
    // Clear legend
    while (this.mapLegend.firstChild) {
      this.mapLegend.removeChild(this.mapLegend.firstChild);
    }

    //Create legend
    for (const dataArrayElement of dataArray) {
      const legendElement = document.createElement('div');
      legendElement.className = 'map-legend';

      const leftLegendElement = document.createElement('div');
      leftLegendElement.className = 'map-legend__left';

      const rightLegendElement = document.createElement('div');
      rightLegendElement.className = 'map-legend__right';

      const legendTitleElement = document.createElement('div');
      legendTitleElement.className = 'map-legend__title';

      const legendLabelElement = document.createElement('div');
      legendLabelElement.className = 'map-legend__description';

      const legendPointerElement = document.createElement('div');
      legendPointerElement.className = 'map-legend__pointer';

      //Set text in legend
      legendTitleElement.textContent = dataArrayElement.title;
      //Set label in legend
      legendLabelElement.textContent = dataArrayElement.label;
      //Set color in legend
      legendPointerElement.style.backgroundColor = dataArrayElement.color;

      //Unite elements
      legendElement.append(leftLegendElement);
      legendElement.append(rightLegendElement);
      leftLegendElement.append(legendPointerElement);
      rightLegendElement.append(legendTitleElement);
      rightLegendElement.append(legendLabelElement);

      this.mapLegend.append(legendElement);
    }
  }

// Change event for select
  onChange(e) {
    const key = e.target.value;
    if (key) {
      const mapDataArrayItem = this.mapDataArray?.reduce((acc, item) => {
        return Object.keys(item).includes(key) ? acc.concat(item[key]) : acc;
      }, []);

      this.removeAllCircles();
      this.renderMapData(mapDataArrayItem);
    }
  }

// Draw circles & set legends
  renderMapData(data) {
    this.drawLegends(data);
    this.drawCircles(this.defaultMarkCoordinate, data);
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

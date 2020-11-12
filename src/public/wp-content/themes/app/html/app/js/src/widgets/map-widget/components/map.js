import { dispatchEvent } from '../utils';
import { createObjectMarker } from '../helpers';

const API_KEY = '755ffee2-20b5-4dc0-aa4e-9d110b9bd5df';

class Map {
  constructor(node) {
    this.map = null;
    this.node = node;

    this.options = {
      controls: ['zoomControl'],
      center: null,
      zoom: null,
      size: 'small',
    };

    this.init();
  }

  init() {
    if (window.ymaps) {
      this.onloadAPICallback();
      return;
    }

    const apiUrl = this.getAPIUrl();
    const params = { apikey: API_KEY };
    const onReady = this.onloadAPICallback.bind(this);

    getAPI({ type: 'js', apiUrl, params })
      .then(() => ymaps.ready(onReady))
      .catch(error => console.error(error));
  }

  onloadAPICallback() {
    const options = this.getOptions();
    this.setOptions(options);

    this.createMapInstance();
    this.configureMap();

    dispatchEvent('onMapInit');
  }

  createMapInstance() {
    this.map = new ymaps.Map(this.node, {
      controls: this.options.controls,
      center: this.options.center,
      zoom: this.options.zoom,
    }, { zoomControlSize: 'small' });
  }

  configureMap() {
    this.map.behaviors.disable('scrollZoom');
  }

  renderMarkers(markers) {
    markers.forEach((data, index) => {
      const placemark = new ymaps.Placemark(data.coords,
        { balloonContent: data.description },
        { ...this.createMarkerIcon(data) },
      );

      placemark.events.add('click', () => {
        dispatchEvent('onMarkerClick', { id: index });
      });

      this.map.geoObjects.add(placemark);
    });
  }

  createMarkerIcon(data) {
    return {
      iconShape: { type: 'Circle', coordinates: [19, 19], radius: 19 },
      iconLayout: this.createIconLayout(data),
    };
  }

  createIconLayout(data) {
    const wrapper = document.createElement('i');
    wrapper.appendChild(createObjectMarker(data.marker, { shadow: true }));

    return ymaps.templateLayoutFactory.createClass(wrapper.innerHTML);
  }

  removeAllMarkers() {
    this.map.geoObjects.removeAll();
  }

  getOptions() {
    const {
      center = '55.76, 37.64',
      zoom = '12',
    } = this.node.dataset;
    return { center: center.split(','), zoom };
  }

  setOptions({ center, zoom }) {
    this.options.center = center;
    this.options.zoom = zoom;
  }

  getAPIUrl() {
    return this.node.dataset.apiUrl;
  }

  static createInstance(node) {
    return new Map(node);
  }
}

export default Map;

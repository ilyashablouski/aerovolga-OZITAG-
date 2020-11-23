import Map from './components/map';
import Tabs from './components/tabs';
import Filters from './components/filters';
import Preview from './components/preview';

import { createObjectCard } from './helpers';

class Widget {
  constructor(node) {
    this.node = node;

    this.Map = null;
    this.Tabs = null;
    this.Filters = null;

    this.createEventListeners();
    this.createComponentInstances();

    this.objectList = this.getInitObjectList();
    this.apiUrl = this.getAPIUrl();
  }

  createComponentInstances() {
    this.Map = Map.createInstance(this.node.querySelector('.js-map'));
    this.Filters = Filters.createInstance(this.node.querySelector('.js-filters'));
    this.Tabs = Tabs.createInstance(this.node.querySelector('.js-tabs'));
    this.Preview = Preview.createInstance(this.node.querySelector('.js-preview'));
  }

  createEventListeners() {
    document.addEventListener('onMapInit', (e) => {
      console.log('on map init', e);
      this.renderMapMarkers();
    });

    document.addEventListener('onFiltersChange', (e) => {
      console.log('on filters change', e);
      this.fetchObjectList();
    });

    document.addEventListener('onMarkerClick', (e) => {
      console.log('on marker click', e);
      this.fetchObjectDetails(e.detail.id);
    });

    document.addEventListener('onTabsChange', (e) => {
      console.log('on tabs change', e);
    });
  }

  getInitObjectList() {
    const objectListNode = this.getObjectListNode(this.Tabs.activeTab);

    return [].map.call(objectListNode.querySelectorAll('.js-object'), (node, index) => {
      const { name, location, schedule, markerColor, markerIcon, coords = '' } = node.dataset;

      const marker = { color: markerColor, icon: markerIcon };
      const coordsArray = coords.split(',');

      node.addEventListener('click', () => {
        this.fetchObjectDetails(index);
      });

      return { name, location, schedule, coords: coordsArray, marker };
    });
  }

  fetchObjectList() {
    const params = {
      category: this.Tabs.activeTab,
      ...this.Filters.options,
    };

    const currTab = this.Tabs.activeTab;

    this.makeRequest(createURL(`${this.apiUrl}/list.json`, params))
      .then(objectList => this.onSuccessFetchObjectList(objectList, currTab))
      .catch(error => console.error(error));
  }

  onSuccessFetchObjectList(objectList, targetTab) {
    this.objectList = objectList;
    this.renderObjectList(targetTab);

    if (targetTab === this.Tabs.activeTab) {
      this.Map.removeAllMarkers();
      this.renderMapMarkers();
    }
  }

  renderMapMarkers() {
    const markerList = this.selectMarkerList();
    this.Map.renderMarkers(markerList);
  }

  selectMarkerList() {
    return this.objectList.map((object) => {
      return { coords: object.coords, marker: object.marker };
    });
  }

  renderObjectList(targetTab) {
    const documentFragment = new DocumentFragment();
    const objectListNode = this.getObjectListNode(targetTab);

    this.objectList.forEach((objectData, index) => {
      const objectCard = createObjectCard(objectData);
      objectCard.querySelector('[data-container]')
        .addEventListener('click', () => {
          this.fetchObjectDetails(index);
        });

      documentFragment.appendChild(objectCard);
    });

    objectListNode.innerHTML = '';
    objectListNode.appendChild(documentFragment);
  }

  getObjectListNode(category) {
    return this.node.querySelector(`.js-objects[data-category=${category}]`);
  }

  fetchObjectDetails(id) {
    this.makeRequest(createURL(`${this.apiUrl}/details.json`, { id }))
      .then(objectDetails => this.onSuccessFetchObjectDetails(objectDetails))
      .catch(error => console.error(error));
  }

  onSuccessFetchObjectDetails(data) {
    this.Preview.showObjectDetails(data);
  }

  makeRequest(url) {
    return fetch(url, {
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {
      return response.json();
    });
  }

  getAPIUrl() {
    return this.node.dataset.apiUrl;
  }

  static createInstance(node) {
    return new Widget(node);
  }
}

/* document.addEventListener('DOMContentLoaded', () => {
  const node = document.querySelector('.js-map-widget');
  if (node) Widget.createInstance(node);
}); */

subscribeToEvent('initModules', () => {
  const node = document.querySelector('.js-map-widget');
  if (node) Widget.createInstance(node);
});
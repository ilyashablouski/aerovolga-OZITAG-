class elevateImageZoom {
  constructor(item) {
    this.imageScale = item;
    this.addEvents();

  }

  addEvents() {
    if(isDesktopLayout() || isLaptopLayout()) {
      const config = {
        width: 438,
        height: 440,
        zoomWidth: 540,
        offset: { vertical: 0, horizontal: 0 },
        zoomPosition: 'original',
      };

      this.zoomContainer = new ImageZoom(this.imageScale, config);
    }
  }


  static init(elem) {
    new elevateImageZoom(elem);
  }
}

subscribeToEvent('initModules', () => {
  const imageZoom = document.querySelectorAll('.js-image-zoom');
  imageZoom.forEach(item => {
    elevateImageZoom.init(item);
  });
});

window.elevateImageZoom = elevateImageZoom;

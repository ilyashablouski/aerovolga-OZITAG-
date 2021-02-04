class Previews {
  constructor(container, previewList) {
    this.container = container;
    this.previewList = previewList;

    this.initialize();
  }

  initialize() {
    this.createEventListeners();

    raf2x(() => {
      Previews.playVideo(this.previewList[0]);
      Previews.setActive(this.previewList[0]);
    })
  }

  createEventListeners() {
    this.previewList.forEach((preview) => {
      preview.addEventListener('mouseenter', () => {
        if (!isLaptopLayout()) this.handlePreviewHover(preview);
      });
    });
  }

  handlePreviewHover(preview) {
    const currActivePreview = this.container.querySelector('.active');

    if (currActivePreview) {
      Previews.pauseVideo(currActivePreview);
      Previews.removeActive(currActivePreview);
    }

    Previews.playVideo(preview);
    Previews.setActive(preview);
  }

  static setActive(elem) {
    elem.classList.add('active');
  }

  static removeActive(elem) {
    elem.classList.remove('active');
  }

  static playVideo(container) {
    const videoPlayer = Previews.getVideoPlayer(container);
    if (videoPlayer) videoPlayer.play();
  }

  static pauseVideo(container) {
    const videoPlayer = Previews.getVideoPlayer(container);
    if (videoPlayer) videoPlayer.pause();
  }

  static getVideoPlayer(container) {
    return container.querySelector('video')
  }

  static createInstance(container, previewList) {
    return new Previews(container, previewList);
  }
}

subscribeToEvent('initModules', () => {
  document.querySelectorAll('.js-previews').forEach(node => {
    const previewList = node.querySelectorAll('.js-preview');
    if (!previewList.length) return;

    Previews.createInstance(node, previewList);
  });
});

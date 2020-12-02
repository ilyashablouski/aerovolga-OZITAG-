class Video {
  constructor(item) {
    this.video = item;
    this.addEvents();
  }

  addEvents() {
    this.video.addEventListener('click', (e) => {
      if (this.video.classList.contains('active')) {
        e.preventDefault();
      } else {
        const videoSrc = this.video.getAttribute('data-video');
        const iframe = this.video.querySelector('iframe');

        this.setActive(this.video);
        iframe.src = `${videoSrc}?;autoplay=1&;controls=0&;showinfo=0`;
      }
    });
  }


  setActive(elem) {
    elem.classList.add('active');
  }


  static init(elem) {
    new Video(elem);
  }
}

subscribeToEvent('initModules', () => {
  const video = document.querySelectorAll('.js-video-block');
  video.forEach(item => {
    Video.init(item);
  });
});

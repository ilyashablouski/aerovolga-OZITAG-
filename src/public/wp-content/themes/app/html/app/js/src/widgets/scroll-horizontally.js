class ScrollHorizontally {

  constructor(nodeElement) {
    this.nodeElement = nodeElement;

    this.addEvent();
  }

  addEvent() {
    this.nodeElement.addEventListener('mousewheel', this.scrollHorizontally);
    this.nodeElement.addEventListener('DOMMouseScroll', this.scrollHorizontally);
  }

  scrollHorizontally(e) {
    const scrollElement = e.target.closest('.js-scroll-horizontally');
    let scrollPos = scrollElement.scrollLeft;

    e = window.event || e;
    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    scrollElement.scrollLeft -= (delta * 15);
    let widthElem = scrollElement.scrollWidth;
    let widthBrowser = document.documentElement.clientWidth;


    if ((delta == 1) && (scrollElement.scrollLeft == 0)) return;

    if ((widthBrowser >= widthElem) || (scrollPos == scrollElement.scrollLeft)) return;

    e.preventDefault(); // запрещает прокрутку по вертикали

  }

  static init(elem) {
    new ScrollHorizontally(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.querySelectorAll('.js-scroll-horizontally');
  scroll.forEach(item => {
    ScrollHorizontally.init(item);
  });
});

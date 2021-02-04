class Navbar {
  constructor(item) {
    this.navbar = item;
    this.addEvents();
  }

  addEvents() {
    window.addEventListener('scroll', () => {
      if (this.navbar.getBoundingClientRect().top === 0) {
        this.setFixed(this.navbar);
      }else if(this.navbar.getBoundingClientRect().top <= 82 && isTabletLayout()) {
        this.setFixed(this.navbar);
      } else if(this.navbar.getBoundingClientRect().top <= 52 && isMobileLayout()){
        this.setFixed(this.navbar);
      } else {
        this.removeFixed(this.navbar);
      }
    });
  }

  setFixed(elem) {
    elem.classList.add('fixed');
  }

  removeFixed(elem) {
    elem.classList.remove('fixed');
  }

  static init(elem) {
    new Navbar(elem);
  }
}


subscribeToEvent('initModules', () => {
  const navbar = document.querySelectorAll('.js-navbar');
  navbar.forEach(item => {
    Navbar.init(item);
  });
});

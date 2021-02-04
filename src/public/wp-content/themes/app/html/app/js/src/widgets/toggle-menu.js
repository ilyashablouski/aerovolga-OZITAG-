class ToggleMenu {
  constructor(item, menu, mainMenu) {
    this.toggleMenu = item;
    this.menu = menu;
    this.mainMenu = mainMenu;

    this.addEvents();
  }

  addEvents() {
    this.toggleMenu.addEventListener('click', () => {

      if (this.toggleMenu.classList.contains('active')) {
        this.removeActive(this.toggleMenu);
        this.removeActive(this.menu);
        this.removeActive(this.mainMenu);

        document.body.style.overflow = 'auto';

        if (window.innerWidth < 1024) {
          this.removeActive(this.menu.parentNode);
          this.menu.parentNode.style.animation = 'mobile-hidden 0.5s linear';
        }
      } else {
        this.setActive(this.toggleMenu);
        this.setActive(this.menu);
        this.setActive(this.mainMenu);
        document.body.style.overflow = 'hidden';

        if (window.innerWidth < 1024) {
          this.setActive(this.menu.parentNode);
          this.menu.parentNode.style.animation = 'none';
        }
      }
    });

    this.menu.addEventListener('click', this.onClick.bind(this));

  }

  onClick(event) {

    if (event.target.classList.contains('js-menu')) {
      this.removeActive(this.toggleMenu);
      this.removeActive(this.menu);
      document.body.style.overflow = 'auto';

      if (window.innerWidth < 1024) {
        this.removeActive(this.menu.parentNode);
        this.menu.parentNode.style.animation = 'mobile-hidden 0.5s linear';
      }
    }

    event.preventDefault();
    const { target } = event;
    const anchor = target.closest('[href]');
    if (!anchor) return null;

    if ('isHome' in anchor.dataset || anchor.textContent === 'home') {
      this.thisIsHome(true);
    } else {
      this.thisIsHome(false);
    }


    if (this.toggleMenu.classList.contains('active') || event.target.classList.contains('js-menu')) {
      this.removeActive(this.toggleMenu);
      this.removeActive(this.menu);
      document.body.style.overflow = 'auto';

      if (window.innerWidth < 1024) {
        this.removeActive(this.menu.parentNode);
        this.menu.parentNode.style.animation = 'mobile-hidden 0.5s linear';
      }
    }
  }

  thisIsHome(isHome) {
    const headerElement = document.querySelector('.js-page-header');
    const mainElement = document.querySelector('.page__content');
    const footerElement = document.querySelector('.js-footer');
    const transitionElement = document.querySelector('.transition');
    const brandElement = document.querySelector('.header-brand');

    if (isHome) {
      if (headerElement) {
        headerElement.classList.add('header--home');
      }

      if (mainElement) {
        mainElement.classList.add('page__content--home');
      }

      if (footerElement) {
        footerElement.classList.add('footer--home');
      }

      if (transitionElement) {
        transitionElement.classList.add('transition--home');
      }

      if (brandElement) {
        brandElement.classList.add('header-brand--home');
      }
    } else {
      if (headerElement) {
        headerElement.classList.remove('header--home');
      }

      if (mainElement) {
        mainElement.classList.remove('page__content--home');
      }

      if (footerElement) {
        footerElement.classList.remove('footer--home');
      }

      if (transitionElement) {
        transitionElement.classList.remove('transition--home');
      }

      if (brandElement) {
        brandElement.classList.remove('header-brand--home');
      }
    }
  }

  setActive(elem) {
    elem.classList.add('active');
  }

  removeActive(elem) {
    elem.classList.remove('active');
  }

  static init(elem, menu, mainMenu) {
    new ToggleMenu(elem, menu, mainMenu);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleMenu = document.querySelectorAll('.js-toggle-menu');
  const menu = document.querySelector('.js-menu');
  const mainMenu = document.querySelector('.js-main-menu');
  toggleMenu.forEach(item => {
    ToggleMenu.init(item, menu, mainMenu);
  });
});

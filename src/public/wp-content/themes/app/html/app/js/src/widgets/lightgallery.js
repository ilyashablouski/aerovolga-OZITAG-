const utils = {
    getAttribute: function (el, label) {
        return el[label];
    },

    setAttribute: function (el, label, value) {
        el[label] = value;
    },

    wrap: function (el, className) {
        if (!el) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = className;
        el.parentNode.insertBefore(wrapper, el);
        el.parentNode.removeChild(el);
        wrapper.appendChild(el);
    },

    addClass: function (el, className) {
        if (!el) {
            return;
        }

        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    },

    removeClass: function (el, className) {
        if (!el) {
            return;
        }

        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },

    hasClass: function (el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    },

    setVendor: function (el, property, value) {
        if (!el) {
            return;
        }

        el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        el.style['webkit' + property] = value;
        el.style['moz' + property] = value;
        el.style['ms' + property] = value;
        el.style['o' + property] = value;
    },

    trigger: function (el, event, detail = null) {
        if (!el) {
            return;
        }

        let customEvent = new CustomEvent(event, {
            detail: detail
        });
        el.dispatchEvent(customEvent);
    },

    Listener: {
        uid: 0
    },

    on: function (el, events, fn) {
        if (!el) {
            return;
        }

        events.split(' ').forEach(event => {
            let _id = this.getAttribute(el, 'lg-event-uid') || '';
            utils.Listener.uid++;
            _id += '&' + utils.Listener.uid;
            this.setAttribute(el, 'lg-event-uid', _id);
            utils.Listener[event + utils.Listener.uid] = fn;
            el.addEventListener(event.split('.')[0], fn, false);
        });
    },

    off: function (el, event) {
        if (!el) {
            return;
        }

        let _id = this.getAttribute(el, 'lg-event-uid');
        if (_id) {
            _id = _id.split('&');
            for (let i = 0; i < _id.length; i++) {
                if (_id[i]) {
                    let _event = event + _id[i];
                    if (_event.substring(0, 1) === '.') {
                        for (let key in utils.Listener) {
                            if (utils.Listener.hasOwnProperty(key)) {
                                if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
                                    el.removeEventListener(key.split('.')[0], utils.Listener[key]);
                                    this.setAttribute(el, 'lg-event-uid', this.getAttribute(el, 'lg-event-uid').replace('&' + _id[i], ''));
                                    delete utils.Listener[key];
                                }
                            }
                        }
                    } else {
                        el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
                        this.setAttribute(el, 'lg-event-uid', this.getAttribute(el, 'lg-event-uid').replace('&' + _id[i], ''));
                        delete utils.Listener[_event];
                    }
                }
            }
        }
    },

    param: function (obj) {
        return Object.keys(obj).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        }).join('&');
    }
};

const selectors = {
    lightGalleryBackdrop: 'light-gallery-backdrop',
    lightGalleryOuter: 'light-gallery-outer',
    lightGallery: 'light-gallery',
    lightGalleryInner: 'light-gallery__inner',
    lightGalleryItem: 'light-gallery__item',

    lightGalleryClose: 'light-gallery__close',
    lightGalleryCloseIcon: 'light-gallery__close-icon',

    lightGalleryThumbOuter: 'light-gallery-thumb-outer',
    lightGalleryThumb: 'light-gallery-thumb',
    lightGalleryThumbItem: 'light-gallery-thumb__item',

    lightGallerySlidesOuter: 'light-gallery-slides-outer',
    lightGallerySlides: 'light-gallery-slides',
    lightGallerySlidesItem: 'light-gallery-slides__item',
}

const defaultOptions = {
    mode: 'lg-slide',

    cssEasing: 'ease',

    easing: 'linear',
    speed: 600,
    width: '1200px',
    height: '340px',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,

    hideBarsDelay: 6000,

    useLeft: false,

    ariaLabelledby: '',

    ariaDescribedby: '',

    closable: true,
    loop: true,
    escKey: true,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: false,

    getCaptionFromTitleOrAlt: true,

    appendSubHtmlTo: '.lg-sub-html',

    subHtmlSelectorRelative: false,

    preload: 1,
    showAfterLoad: true,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',

    index: false,

    iframeMaxWidth: '100%',

    download: true,
    counter: true,
    appendCounterTo: '.lg-toolbar',

    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,

    dynamic: false,
    dynamicEl: [],
    galleryId: 1,
    supportLegacyBrowser: true
};

class LightGallery {

    constructor(element, options) {
        this.options = Object.assign({}, defaultOptions, options);

        if (typeof element === 'string') {
            this.initialSelector = element;
            this.element = document.querySelector(element);
            if (!this.element) return;
        } else {
            this.element = element;
            if (!this.element) return;
        }

        this.images = Array.from(this.element.querySelectorAll('.js-light-gallery-image'));

        // this.init();
    }

    init() {
        this.structure();
        // this.closeGallery();
    }

    structure() {
        document.body.insertAdjacentHTML('beforeend', `<div class="${selectors.lightGalleryBackdrop}"></div>`);
        const backdropElement = document.querySelector(`.${selectors.lightGalleryBackdrop}`);
        utils.setVendor(backdropElement, 'TransitionDuration', this.options.backdropDuration + 'ms');
    
        let list = '';

        for (i = 0; i < this.images.length; i++) {
            const original = this.images[i].getAttribute("data-original");

            list += `
                <div class="${selectors.lightGallerySlidesItem}">
                    <img class="js-light-gallery-image" src="${original}">
                </div>
            `;
        }

        const closeTemplate = `
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3564 10.0703L19.9951 18.7091L18.6389 20.0654L10 11.4266L1.36108 20.0654L0.00488281 18.7091L8.64355 10.0703L0.00463867 1.43134L1.36108 0.0750122L10 8.71393L18.6389 0.0750122L19.9954 1.43134L11.3564 10.0703Z" fill="currentColor"/>
            </svg>
        `;

        const template = `
            <div class="${selectors.lightGalleryOuter}">
                <div class="${selectors.lightGallery}" style="width: ${this.options.width}; height: ${this.options.height};">
                    <div class="${selectors.lightGalleryThumbOuter}">
                        <div class="${selectors.lightGalleryThumb}">
                            <div class="${selectors.lightGalleryThumbItem} active">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                            <div class="${selectors.lightGalleryThumbItem}">
                                <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" />
                            </div>
                        </div>
                    </div>
                    <div class="${selectors.lightGallerySlidesOuter}">
                        <div class="${selectors.lightGallerySlides}">
                            ${list}
                        </div>
                    </div>
                    <button type="button" class="${selectors.lightGalleryClose} ${selectors.lightGalleryCloseIcon}">
                        ${closeTemplate}
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);
        this.lightGalleryOuter = document.querySelector(`.${selectors.lightGalleryOuter}`);
        
        setTimeout(function () {
            utils.addClass(backdropElement, 'in');
        });

        setTimeout(() => {
            utils.addClass(this.lightGalleryOuter, 'visible');
        }, this.options.backdropDuration);
    }  
    
    closeGallery() {
        utils.on(this.lightGalleryOuter.querySelector(`.${selectors.lightGalleryClose}`), 'click', function () {
            console.log('close');
        });
    }
}

class LightGalleryUI {
    static init() {
        document.querySelectorAll('.js-light-gallery').forEach((nodeElement) => {
            new LightGallery(nodeElement);
        });
        
        new LightGallery(document.querySelector('.js-light-gallery'));
    }

    static initOnLoad() {
        document.addEventListener('DOMContentLoaded', this.init);
    }
}

LightGalleryUI.initOnLoad();
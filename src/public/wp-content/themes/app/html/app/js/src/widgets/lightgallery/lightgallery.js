import './polyfill';
import { utils } from './utils';
import { Thumbnail } from './thumbnail';

window.utils = utils;

window.lgData = {
    uid: 0
};

window.lgModules = {
    thumbnail: Thumbnail,
};

const defaults = {
    mode: 'lg-slide',
    cssEasing: 'ease',
    easing: 'linear',
    speed: 600,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,
    hideBarsDelay: 0,
    useLeft: false,
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
        this.el = element;

        this.s = Object.assign({}, defaults, options);

        if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
            throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
        }

        this.modules = {};

        this.lGalleryOn = false;

        this.lgBusy = false;

        this.hideBartimeout = false;

        this.isTouch = ('ontouchstart' in document.documentElement);

        if (this.s.slideEndAnimatoin) {
            this.s.hideControlOnEnd = false;
        }

        this.items = [];

        if (this.s.dynamic) {
            this.items = this.s.dynamicEl;
        } else {
            if (this.s.selector === 'this') {
                this.items.push(this.el);
            } else if (this.s.selector !== '') {
                if (this.s.selectWithin) {
                    this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
                } else {
                    this.items = this.el.querySelectorAll(this.s.selector);
                }
            } else {
                this.items = this.el.children;
            }
        }

        this.___slide = '';

        this.outer = '';

        this.init();
    }

    init() {
        if (this.s.preload > this.items.length) {
            this.s.preload = this.items.length;
        }

        let _hash = window.location.hash;
        if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {

            this.index = parseInt(_hash.split('&slide=')[1], 10);

            utils.addClass(document.body, 'lg-from-hash');
            if (!utils.hasClass(document.body, 'lg-on')) {
                utils.addClass(document.body, 'lg-on');
                setTimeout(() => {
                    this.build(this.index);
                });
            }
        }

        if (this.s.dynamic) {
            utils.trigger(this.el, 'onBeforeOpen');

            this.index = this.s.index || 0;

            if (!utils.hasClass(document.body, 'lg-on')) {
                utils.addClass(document.body, 'lg-on');
                setTimeout(() => {
                    this.build(this.index);
                });
            }
        } else {
            for (let i = 0; i < this.items.length; i++) {
                ((index) => {
                    utils.on(this.items[index], 'click.lgcustom', (e) => {
                        e.preventDefault();

                        utils.trigger(this.el, 'onBeforeOpen');

                        this.index = this.s.index || index;

                        if (!utils.hasClass(document.body, 'lg-on')) {
                            this.build(this.index);
                            utils.addClass(document.body, 'lg-on');
                        }
                    });
                })(i);
            }
        }
    }

    build(index) {
        this.structure();

        for (let key in window.lgModules) {
            this.modules[key] = new window.lgModules[key](this.el);
        }

        this.slide(index, false, false);

        if (this.s.keyPress) {
            this.keyPress();
        }

        if (this.items.length > 1) {
            this.arrow();

            setTimeout(() => {
                this.enableDrag();
                this.enableSwipe();
            }, 50);

            if (this.s.mousewheel) {
                this.mousewheel();
            }
        }

        this.counter();
        this.closeGallery();
        utils.trigger(this.el, 'onAfterOpen');

        if (this.s.hideBarsDelay > 0) {
            const initialHideBarTimeout = setTimeout(() => {
                utils.addClass(this.outer, 'lg-hide-items');
            }, this.s.hideBarsDelay);
            utils.on(this.outer, 'mousemove.lg click.lg touchstart.lg', () => {
                clearTimeout(initialHideBarTimeout);

                utils.removeClass(this.outer, 'lg-hide-items');

                clearTimeout(this.hideBartimeout);

                this.hideBartimeout = setTimeout(() => {
                    utils.addClass(this.outer, 'lg-hide-items');
                }, this.s.hideBarsDelay);
            });
        }
    }

    structure() {
        let list = '';
        let controls = '';
        let i = 0;
        let subHtmlCont = '';
        let template;
 
        document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
        utils.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');

        for (i = 0; i < this.items.length; i++) {
            list += '<div class="lg-item"></div>';
        }

        if (this.s.controls && this.items.length > 1) {
            controls = `
                <div class="lg-actions">
                    <button type="button" aria-label="Previous slide" class="lg-prev lg-icon">${this.s.prevHtml}</button>
                    <button type="button" aria-label="Next slide" class="lg-next lg-icon">${this.s.nextHtml}</button>
                </div>
            `;
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            subHtmlCont = '<div class="lg-sub-html"></div>';
        }

        template = `
            <div class="lg-outer ${this.s.addClass} ${this.s.startClass}">
                <div class="lg" style="width: ${this.s.width}; height: ${this.s.height}">
                    <div class="lg-something">
                        <div class="lg-inner">${list}</div>
                        <div class="lg-toolbar lg-group"></div>
                        ${controls}
                        ${subHtmlCont}
                    </div>
                    <button type="button" class="lg-close">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3564 10.0703L19.9951 18.7091L18.6389 20.0654L10 11.4266L1.36108 20.0654L0.00488281 18.7091L8.64355 10.0703L0.00463867 1.43134L1.36108 0.0750122L10 8.71393L18.6389 0.0750122L19.9954 1.43134L11.3564 10.0703Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);
        this.outer = document.querySelector('.lg-outer');
        this.outer.focus();
        this.___slide = this.outer.querySelectorAll('.lg-item');

        if (this.s.useLeft) {
            utils.addClass(this.outer, 'lg-use-left');
            this.s.mode = 'lg-slide';
        } else {
            utils.addClass(this.outer, 'lg-use-css3');
        }

        this.setTop();
        utils.on(window, 'resize.lg orientationchange.lg', () => {
            setTimeout(() => {
                this.setTop();
            }, 100);
        });

        utils.addClass(this.___slide[this.index], 'lg-current');

        if (this.doCss()) {
            utils.addClass(this.outer, 'lg-css3');
        } else {
            utils.addClass(this.outer, 'lg-css');
            this.s.speed = 0;
        }

        utils.addClass(this.outer, this.s.mode);

        if (this.s.enableDrag && this.items.length > 1) {
            utils.addClass(this.outer, 'lg-grab');
        }

        if (this.s.showAfterLoad) {
            utils.addClass(this.outer, 'lg-show-after-load');
        }

        if (this.doCss()) {
            let inner = this.outer.querySelector('.lg-inner');
            utils.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
            utils.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
        }

        setTimeout(() => {
            utils.addClass(document.querySelector('.lg-backdrop'), 'in');
        });


        setTimeout(() => {
            utils.addClass(this.outer, 'lg-visible');
        }, this.s.backdropDuration);

        if (this.s.download) {
            this.outer.querySelector('.lg-something').insertAdjacentHTML('beforeend', `
                <a id="lg-download" target="_blank" download class="lg-download">
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L6 1H7L7 11H6Z" fill="currentColor"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.74878 6.33164L0.95752 7.12294L6.45483 11.6684L6.5 11.6233L6.54492 11.6684L12.0425 7.12294L11.2512 6.33164L6.5 10.185L1.74878 6.33164Z" fill="currentColor"/>
                    </svg>
                    Download
                </a>
            `);
        }

        this.prevScrollTop = (document.documentElement.scrollTop || document.body.scrollTop)
    }

    setTop() {
        if (this.s.height !== '100%') {
            let wH = window.innerHeight;
            let top = (wH - parseInt(this.s.height, 10)) / 2;
            let lGallery = this.outer.querySelector('.lg');
            if (wH >= parseInt(this.s.height, 10)) {
                lGallery.style.top = top + 'px';
            } else {
                lGallery.style.top = '0px';
            }
        }
    }

    doCss() {
        const support = function () {
            const transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
            const root = document.documentElement;
            for (let i = 0; i < transition.length; i++) {
                if (transition[i] in root.style) {
                    return true;
                }
            }
        };

        if (support()) {
            return true;
        }

        return false;
    }

    isVideo(src, index) {
        let html;

        if (this.s.dynamic) {
            html = this.s.dynamicEl[index].html;
        } else {
            html = this.items[index].getAttribute('data-html');
        }

        if (!src && html) {
            return {
                html5: true
            };
        }

        const youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
        const vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i);
        const dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
        const vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

        if (youtube) {
            return { youtube };
        } else if (vimeo) {
            return { vimeo };
        } else if (dailymotion) {
            return { dailymotion };
        } else if (vk) {
            return { vk };
        }
    }

    counter() {
        if (this.s.counter) {
            this.outer.querySelector('.lg-something').insertAdjacentHTML('beforeend', `
                <div id="lg-counter">
                    <span id="lg-counter-current">${(parseInt(this.index, 10) + 1)}</span> / <span id="lg-counter-all">${this.items.length}</span>
                </div>
            `);
        }
    }

    addHtml(index) {
        let subHtml = null;
        let currentEle;

        if (this.s.dynamic) {
            subHtml = this.s.dynamicEl[index].subHtml;
        } else {
            currentEle = this.items[index];
            subHtml = currentEle.getAttribute('data-sub-html');
            if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
                subHtml = currentEle.getAttribute('title');
                if (subHtml && currentEle.querySelector('img')) {
                    subHtml = currentEle.querySelector('img').getAttribute('alt');
                }
            }
        }

        if (typeof subHtml !== 'undefined' && subHtml !== null) {

            const fL = subHtml.substring(0, 1);
            if (fL === '.' || fL === '#') {
                if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                    subHtml = currentEle.querySelector(subHtml).innerHTML;
                } else {
                    subHtml = document.querySelector(subHtml).innerHTML;
                }
            }
        } else {
            subHtml = '';
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
        } else {
            this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
        }

        if (typeof subHtml !== 'undefined' && subHtml !== null) {
            if (subHtml === '') {
                utils.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
            } else {
                utils.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
            }
        }

        utils.trigger(this.el, 'onAfterAppendSubHtml', {
            index: index
        });
    }

    preload(index) {
        for (let i = 1; i <= this.s.preload; i++) {
            if (i >= this.items.length - index) {
                break;
            }

            this.loadContent(index + i, false, 0);
        }

        for (let j = 1; j <= this.s.preload; j++) {
            if (index - j < 0) {
                break;
            }

            this.loadContent(index - j, false, 0);
        }
    }

    loadContent(index, rec, delay) {
        let _hasPoster = false;
        let _img;
        let _src;
        let _poster;
        let _srcset;
        let _sizes;
        let _html;
        let _alt;

        const getResponsiveSrc = function(srcItms) {
            let rsWidth = [];
            let rsSrc = [];
            for (let i = 0; i < srcItms.length; i++) {
                let __src = srcItms[i].split(' ');

                if (__src[0] === '') {
                    __src.splice(0, 1);
                }

                rsSrc.push(__src[0]);
                rsWidth.push(__src[1]);
            }

            const wWidth = window.innerWidth;
            for (let j = 0; j < rsWidth.length; j++) {
                if (parseInt(rsWidth[j], 10) > wWidth) {
                    _src = rsSrc[j];
                    break;
                }
            }
        };

        if (this.s.dynamic) {
            if (this.s.dynamicEl[index].poster) {
                _hasPoster = true;
                _poster = this.s.dynamicEl[index].poster;
            }

            _html = this.s.dynamicEl[index].html;
            _src = this.s.dynamicEl[index].src;
            _alt = this.s.dynamicEl[index].alt;

            if (this.s.dynamicEl[index].responsive) {
                const srcDyItms = this.s.dynamicEl[index].responsive.split(',');
                getResponsiveSrc(srcDyItms);
            }

            _srcset = this.s.dynamicEl[index].srcset;
            _sizes = this.s.dynamicEl[index].sizes;
        } else {
            if (this.items[index].getAttribute('data-poster')) {
                _hasPoster = true;
                _poster = this.items[index].getAttribute('data-poster');
            }

            _html = this.items[index].getAttribute('data-html');
            _src = this.items[index].getAttribute('href') || this.items[index].getAttribute('data-src');
            _alt = this.items[index].getAttribute('title');

            if (this.items[index].querySelector('img')) {
                _alt = _alt || this.items[index].querySelector('img').getAttribute('alt');
            }

            if (this.items[index].getAttribute('data-responsive')) {
                const srcItms = this.items[index].getAttribute('data-responsive').split(',');
                getResponsiveSrc(srcItms);
            }

            _srcset = this.items[index].getAttribute('data-srcset');
            _sizes = this.items[index].getAttribute('data-sizes');
        }

        let iframe = false;
        if (this.s.dynamic) {
            if (this.s.dynamicEl[index].iframe) {
                iframe = true;
            }
        } else {
            if (this.items[index].getAttribute('data-iframe') === 'true') {
                iframe = true;
            }
        }

        const _isVideo = this.isVideo(_src, index);
        if (!utils.hasClass(this.___slide[index], 'lg-loaded')) {
            if (iframe) {
                this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
            } else if (_hasPoster) {
                let videoClass = '';
                if (_isVideo && _isVideo.youtube) {
                    videoClass = 'lg-has-youtube';
                } else if (_isVideo && _isVideo.vimeo) {
                    videoClass = 'lg-has-vimeo';
                } else {
                    videoClass = 'lg-has-html5';
                }

                this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

            } else if (_isVideo) {
                this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
                utils.trigger(this.el, 'hasVideo', {
                    index: index,
                    src: _src,
                    html: _html
                });
            } else {
                _alt = _alt ? 'alt="' + _alt + '"' : '';
                this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" ' + _alt + ' src="' + _src + '" /></div>');
            }

            utils.trigger(this.el, 'onAferAppendSlide', {
                index: index
            });

            _img = this.___slide[index].querySelector('.lg-object');
            if (_sizes) {
                _img.setAttribute('sizes', _sizes);
            }

            if (_srcset) {
                _img.setAttribute('srcset', _srcset);

                if (this.s.supportLegacyBrowser) {
                    try {
                        picturefill({
                            elements: [_img[0]]
                        });
                    } catch (e) {
                        console.warn('If you want srcset to be supported for older browsers, ' +
                            'please include picturefil javascript library in your document.');
                    }
                }
            }

            if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                this.addHtml(index);
            }

            utils.addClass(this.___slide[index], 'lg-loaded');
        }

        utils.on(this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', () => {
            let _speed = 0;

            if (delay && !utils.hasClass(document.body, 'lg-from-hash')) {
                _speed = delay;
            }

            setTimeout(() => {
                utils.addClass(this.___slide[index], 'lg-complete');

                utils.trigger(this.el, 'onSlideItemLoad', {
                    index: index,
                    delay: delay || 0
                });
            }, _speed);
        });

        if (_isVideo && _isVideo.html5 && !_hasPoster) {
            utils.addClass(this.___slide[index], 'lg-complete');
        }

        if (rec === true) {
            if (!utils.hasClass(this.___slide[index], 'lg-complete')) {
                utils.on(this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', () => {
                    this.preload(index);
                });
            } else {
                this.preload(index);
            }
        }
    }

    slide(index, fromTouch, fromThumb) {
        let _prevIndex = 0;

        for (let i = 0; i < this.___slide.length; i++) {
            if (utils.hasClass(this.___slide[i], 'lg-current')) {
                _prevIndex = i;
                break;
            }
        }

        if (this.lGalleryOn && (_prevIndex === index)) {
            return;
        }

        const _length = this.___slide.length;
        const _time = this.lGalleryOn ? this.s.speed : 0;
        let _next = false;
        let _prev = false;

        if (!this.lgBusy) {
            if (this.s.download) {
                let _src;
                if (this.s.dynamic) {
                    _src = this.s.dynamicEl[index].downloadUrl !== false && (this.s.dynamicEl[index].downloadUrl || this.s.dynamicEl[index].src);
                } else {
                    _src = this.items[index].getAttribute('data-download-url') !== 'false' && (this.items[index].getAttribute('data-download-url') || this.items[index].getAttribute('href') || this.items[index].getAttribute('data-src'));
                }

                if (_src) {
                    document.getElementById('lg-download').setAttribute('href', _src);
                    utils.removeClass(this.outer, 'lg-hide-download');
                } else {
                    utils.addClass(this.outer, 'lg-hide-download');
                }
            }

            utils.trigger(this.el, 'onBeforeSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });

            this.lgBusy = true;

            clearTimeout(this.hideBartimeout);

            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                setTimeout(() => {
                    this.addHtml(index);
                }, _time);
            }

            this.arrowDisable(index);

            if (!fromTouch) {
                utils.addClass(this.outer, 'lg-no-trans');

                for (let j = 0; j < this.___slide.length; j++) {
                    utils.removeClass(this.___slide[j], 'lg-prev-slide');
                    utils.removeClass(this.___slide[j], 'lg-next-slide');
                }

                if (index < _prevIndex) {
                    _prev = true;
                    if ((index === 0) && (_prevIndex === _length - 1) && !fromThumb) {
                        _prev = false;
                        _next = true;
                    }
                } else if (index > _prevIndex) {
                    _next = true;
                    if ((index === _length - 1) && (_prevIndex === 0) && !fromThumb) {
                        _prev = true;
                        _next = false;
                    }
                }

                if (_prev) {
                    utils.addClass(this.___slide[index], 'lg-prev-slide');
                    utils.addClass(this.___slide[_prevIndex], 'lg-next-slide');
                } else if (_next) {
                    utils.addClass(this.___slide[index], 'lg-next-slide');
                    utils.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
                }

                setTimeout(() => {
                    utils.removeClass(this.outer.querySelector('.lg-current'), 'lg-current');
                    utils.addClass(this.___slide[index], 'lg-current');
                    utils.removeClass(this.outer, 'lg-no-trans');
                }, 50);
            } else {

                let touchPrev = index - 1;
                let touchNext = index + 1;

                if ((index === 0) && (_prevIndex === _length - 1)) {
                    touchNext = 0;
                    touchPrev = _length - 1;
                } else if ((index === _length - 1) && (_prevIndex === 0)) {
                    touchNext = 0;
                    touchPrev = _length - 1;
                }

                utils.removeClass(this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
                utils.removeClass(this.outer.querySelector('.lg-current'), 'lg-current');
                utils.removeClass(this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
                utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
                utils.addClass(this.___slide[touchNext], 'lg-next-slide');
                utils.addClass(this.___slide[index], 'lg-current');
            }

            if (this.lGalleryOn) {
                setTimeout(() => {
                    this.loadContent(index, true, 0);
                }, this.s.speed + 50);

                setTimeout(() => {
                    this.lgBusy = false;
                    utils.trigger(this.el, 'onAfterSlide', {
                        prevIndex: _prevIndex,
                        index: index,
                        fromTouch: fromTouch,
                        fromThumb: fromThumb
                    });
                }, this.s.speed);

            } else {
                this.loadContent(index, true, this.s.backdropDuration);

                this.lgBusy = false;
                utils.trigger(this.el, 'onAfterSlide', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb
                });
            }

            this.lGalleryOn = true;

            if (this.s.counter) {
                if (document.getElementById('lg-counter-current')) {
                    document.getElementById('lg-counter-current').innerHTML = index + 1;
                }
            }
        }
    }

    goToNextSlide(fromTouch) {
        if (!this.lgBusy) {
            if ((this.index + 1) < this.___slide.length) {
                this.index++;
                utils.trigger(this.el, 'onBeforeNextSlide', {
                    index: this.index
                });
                this.slide(this.index, fromTouch, false);
            } else {
                if (this.s.loop) {
                    this.index = 0;
                    utils.trigger(this.el, 'onBeforeNextSlide', {
                        index: this.index
                    });
                    this.slide(this.index, fromTouch, false);
                } else if (this.s.slideEndAnimatoin) {
                    utils.addClass(this.outer, 'lg-right-end');
                    setTimeout(() => {
                        utils.removeClass(this.outer, 'lg-right-end');
                    }, 400);
                }
            }
        }
    }

    goToPrevSlide(fromTouch) {
        if (!this.lgBusy) {
            if (this.index > 0) {
                this.index--;
                utils.trigger(this.el, 'onBeforePrevSlide', {
                    index: this.index,
                    fromTouch: fromTouch
                });
                this.slide(this.index, fromTouch, false);
            } else {
                if (this.s.loop) {
                    this.index = this.items.length - 1;
                    utils.trigger(this.el, 'onBeforePrevSlide', {
                        index: this.index,
                        fromTouch: fromTouch
                    });
                    this.slide(this.index, fromTouch, false);
                } else if (this.s.slideEndAnimatoin) {
                    utils.addClass(this.outer, 'lg-left-end');
                    setTimeout(() => {
                        utils.removeClass(this.outer, 'lg-left-end');
                    }, 400);
                }
            }
        }
    }

    keyPress() {
        if (this.items.length > 1) {
            utils.on(window, 'keyup.lg', (e) => {
                if (this.items.length > 1) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        this.goToPrevSlide();
                    }

                    if (e.keyCode === 39) {
                        e.preventDefault();
                        this.goToNextSlide();
                    }
                }
            });
        }

        utils.on(window, 'keydown.lg', (e) => {
            if (this.s.escKey === true && e.keyCode === 27) {
                e.preventDefault();
                if (!utils.hasClass(this.outer, 'lg-thumb-open')) {
                    this.destroy();
                } else {
                    utils.removeClass(this.outer, 'lg-thumb-open');
                }
            }
        });
    }

    arrow() {
        utils.on(this.outer.querySelector('.lg-prev'), 'click.lg', () => {
            this.goToPrevSlide();
        });

        utils.on(this.outer.querySelector('.lg-next'), 'click.lg', () => {
            this.goToNextSlide();
        });
    }

    arrowDisable(index) {
        if (!this.s.loop && this.s.hideControlOnEnd) {
            const next = this.outer.querySelector('.lg-next');
            const prev = this.outer.querySelector('.lg-prev');
            if ((index + 1) < this.___slide.length) {
                next.removeAttribute('disabled');
                utils.removeClass(next, 'disabled');
            } else {
                next.setAttribute('disabled', 'disabled');
                utils.addClass(next, 'disabled');
            }

            if (index > 0) {
                prev.removeAttribute('disabled');
                utils.removeClass(prev, 'disabled');
            } else {
                prev.setAttribute('disabled', 'disabled');
                utils.addClass(prev, 'disabled');
            }
        }
    }

    setTranslate(el, xValue, yValue) {
        if (this.s.useLeft) {
            el.style.left = xValue;
        } else {
            utils.setVendor(el, 'Transform', 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)');
        }
    }

    touchMove(startCoords, endCoords) {
        const distance = endCoords - startCoords;

        if (Math.abs(distance) > 15) {
            utils.addClass(this.outer, 'lg-dragging');

            this.setTranslate(this.___slide[this.index], distance, 0);

            this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
            this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
        }
    }

    touchEnd(distance) {
        if (this.s.mode !== 'lg-slide') {
            utils.addClass(this.outer, 'lg-slide');
        }

        for (let i = 0; i < this.___slide.length; i++) {
            if (!utils.hasClass(this.___slide[i], 'lg-current') && !utils.hasClass(this.___slide[i], 'lg-prev-slide') && !utils.hasClass(this.___slide[i], 'lg-next-slide')) {
                this.___slide[i].style.opacity = '0';
            }
        }

        setTimeout(() => {
            utils.removeClass(this.outer, 'lg-dragging');

            if ((distance < 0) && (Math.abs(distance) > this.s.swipeThreshold)) {
                this.goToNextSlide(true);
            } else if ((distance > 0) && (Math.abs(distance) > this.s.swipeThreshold)) {
                this.goToPrevSlide(true);
            } else if (Math.abs(distance) < 5) {
                utils.trigger(this.el, 'onSlideClick');
            }

            for (let i = 0; i < this.___slide.length; i++) {
                this.___slide[i].removeAttribute('style');
            }
        });

        setTimeout(() => {
            if (!utils.hasClass(this.outer, 'lg-dragging') && this.s.mode !== 'lg-slide') {
                utils.removeClass(this.outer, 'lg-slide');
            }
        }, this.s.speed + 100);
    }

    enableSwipe() {
        let startCoords = 0;
        let endCoords = 0;
        let isMoved = false;

        if (this.s.enableSwipe && this.isTouch && this.doCss()) {
            for (let i = 0; i < this.___slide.length; i++) {
                utils.on(this.___slide[i], 'touchstart.lg', (e) => {
                    if (!utils.hasClass(this.outer, 'lg-zoomed') && !this.lgBusy) {
                        e.preventDefault();
                        this.manageSwipeClass();
                        startCoords = e.targetTouches[0].pageX;
                    }
                });
            }

            for (let j = 0; j < this.___slide.length; j++) {
                utils.on(this.___slide[j], 'touchmove.lg', (e) => {
                    if (!utils.hasClass(this.outer, 'lg-zoomed')) {
                        e.preventDefault();
                        endCoords = e.targetTouches[0].pageX;
                        this.touchMove(startCoords, endCoords);
                        isMoved = true;
                    }
                });
            }

            for (let k = 0; k < this.___slide.length; k++) {
                utils.on(this.___slide[k], 'touchend.lg', () => {
                    if (!utils.hasClass(this.outer, 'lg-zoomed')) {
                        if (isMoved) {
                            isMoved = false;
                            this.touchEnd(endCoords - startCoords);
                        } else {
                            utils.trigger(this.el, 'onSlideClick');
                        }
                    }
                });
            }
        }
    }

    enableDrag() {
        let startCoords = 0;
        let endCoords = 0;
        let isDraging = false;
        let isMoved = false;

        if (this.s.enableDrag && !this.isTouch && this.doCss()) {
            for (let i = 0; i < this.___slide.length; i++) {
                utils.on(this.___slide[i], 'mousedown.lg', (e) => {
                    if (!utils.hasClass(this.outer, 'lg-zoomed')) {
                        if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                            e.preventDefault();

                            if (!this.lgBusy) {
                                this.manageSwipeClass();
                                startCoords = e.pageX;
                                isDraging = true;

                                this.outer.scrollLeft += 1;
                                this.outer.scrollLeft -= 1;

                                utils.removeClass(this.outer, 'lg-grab');
                                utils.addClass(this.outer, 'lg-grabbing');

                                utils.trigger(this.el, 'onDragstart');
                            }
                        }
                    }
                });
            }

            utils.on(window, 'mousemove.lg', (e) => {
                if (isDraging) {
                    isMoved = true;
                    endCoords = e.pageX;
                    this.touchMove(startCoords, endCoords);
                    utils.trigger(this.el, 'onDragmove');
                }
            });

            utils.on(window, 'mouseup.lg', (e) => {
                if (isMoved) {
                    isMoved = false;
                    this.touchEnd(endCoords - startCoords);
                    utils.trigger(this.el, 'onDragend');
                } else if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                    utils.trigger(this.el, 'onSlideClick');
                }

                if (isDraging) {
                    isDraging = false;
                    utils.removeClass(this.outer, 'lg-grabbing');
                    utils.addClass(this.outer, 'lg-grab');
                }
            });
        }
    }

    manageSwipeClass() {
        let touchNext = this.index + 1;
        let touchPrev = this.index - 1;
        const length = this.___slide.length;

        if (this.s.loop) {
            if (this.index === 0) {
                touchPrev = length - 1;
            } else if (this.index === length - 1) {
                touchNext = 0;
            }
        }

        for (let i = 0; i < this.___slide.length; i++) {
            utils.removeClass(this.___slide[i], 'lg-next-slide');
            utils.removeClass(this.___slide[i], 'lg-prev-slide');
        }

        if (touchPrev > -1) {
            utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
        }

        utils.addClass(this.___slide[touchNext], 'lg-next-slide');
    }

    mousewheel() {
        utils.on(this.outer, 'mousewheel.lg', (e) => {
            if (!e.deltaY) {
                return;
            }

            if (e.deltaY > 0) {
                this.goToPrevSlide();
            } else {
                this.goToNextSlide();
            }

            e.preventDefault();
        });
    }

    closeGallery() {
        let mousedown = false;

        utils.on(this.outer.querySelector('.lg-close'), 'click.lg', () => {
            this.destroy();
        });

        if (this.s.closable) {
            utils.on(this.outer, 'mousedown.lg', (e) => {
                if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap')) {
                    mousedown = true;
                } else {
                    mousedown = false;
                }
            });

            utils.on(this.outer, 'mouseup.lg', (e) => {
                if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap') && mousedown) {
                    if (!utils.hasClass(this.outer, 'lg-dragging')) {
                        this.destroy();
                    }
                }
            });
        }
    }

    destroy(d) {
        if (!d) {
            utils.trigger(this.el, 'onBeforeClose');
        }

        document.body.scrollTop = this.prevScrollTop;
        document.documentElement.scrollTop = this.prevScrollTop;

        if (d) {
            if (!this.s.dynamic) {
                for (let i = 0; i < this.items.length; i++) {
                    utils.off(this.items[i], '.lg');
                    utils.off(this.items[i], '.lgcustom');
                }
            }

            const lguid = this.el.getAttribute('lg-uid');
            delete window.lgData[lguid];
            this.el.removeAttribute('lg-uid');
        }

        utils.off(this.el, '.lgtm');

        for (let key in window.lgModules) {
            if (this.modules[key]) {
                this.modules[key].destroy(d);
            }
        }

        this.lGalleryOn = false;

        clearTimeout(this.hideBartimeout);
        this.hideBartimeout = false;
        utils.off(window, '.lg');
        utils.removeClass(document.body, 'lg-on');
        utils.removeClass(document.body, 'lg-from-hash');

        if (this.outer) {
            utils.removeClass(this.outer, 'lg-visible');
        }

        utils.removeClass(document.querySelector('.lg-backdrop'), 'in');
        setTimeout(() => {
            try {
                if (this.outer) {
                    this.outer.parentNode.removeChild(this.outer);
                }

                if (document.querySelector('.lg-backdrop')) {
                    document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
                }

                if (!d) {
                    utils.trigger(this.el, 'onCloseAfter');
                }
                this.el.focus();
            } catch (err) { }

        }, this.s.backdropDuration + 50);
    }
}

function lightGallery(el, options) {
    if (!el) {
        return;
    }

    try {
        if (!el.getAttribute('lg-uid')) {
            let uid = 'lg' + window.lgData.uid++;
            window.lgData[uid] = new LightGallery(el, options);
            el.setAttribute('lg-uid', uid);
        } else {
            window.lgData[el.getAttribute('lg-uid')].init();
        }
    } catch (err) {
        console.error('lightGallery has not initiated properly', err);
    }
};

class LightGalleryUI {
    static init() {
        document.querySelectorAll('.js-light-gallery').forEach((nodeElement) => {
            lightGallery(nodeElement, {
                thumbnail: true,
                width: '1200px',
                height: '600px',
            });
        });
    }

    static initOnLoad() {
        // document.addEventListener('DOMContentLoaded', this.init);
        subscribeToEvent('initModules', () => {
            this.init();
        });
    }
}

LightGalleryUI.initOnLoad();
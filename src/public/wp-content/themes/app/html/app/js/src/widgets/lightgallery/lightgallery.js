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
    hideBarsDelay: 6000,
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
    appendCounterTo: '.lg-toolbar',
    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,
    dynamic: false,
    dynamicEl: [],
    galleryId: 1,
    supportLegacyBrowser: true
};

class Plugin {
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
                    <button type="button" class="lg-close lg-icon"></button>
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
            this.outer.querySelector('.lg-something').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download">Download</a>');
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
}

Plugin.prototype.counter = function() {
    if (this.s.counter) {
        this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter" role="status" aria-live="polite"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
    }
};

Plugin.prototype.addHtml = function(index) {
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

        var fL = subHtml.substring(0, 1);
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
};

Plugin.prototype.preload = function(index) {
    var i = 1;
    var j = 1;
    for (i = 1; i <= this.s.preload; i++) {
        if (i >= this.items.length - index) {
            break;
        }

        this.loadContent(index + i, false, 0);
    }

    for (j = 1; j <= this.s.preload; j++) {
        if (index - j < 0) {
            break;
        }

        this.loadContent(index - j, false, 0);
    }
};

Plugin.prototype.loadContent = function(index, rec, delay) {

    var _this = this;
    var _hasPoster = false;
    var _img;
    var _src;
    var _poster;
    var _srcset;
    var _sizes;
    var _html;
    var _alt;
    var getResponsiveSrc = function(srcItms) {
        var rsWidth = [];
        var rsSrc = [];
        for (var i = 0; i < srcItms.length; i++) {
            var __src = srcItms[i].split(' ');

            if (__src[0] === '') {
                __src.splice(0, 1);
            }

            rsSrc.push(__src[0]);
            rsWidth.push(__src[1]);
        }

        var wWidth = window.innerWidth;
        for (var j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                _src = rsSrc[j];
                break;
            }
        }
    };

    if (_this.s.dynamic) {

        if (_this.s.dynamicEl[index].poster) {
            _hasPoster = true;
            _poster = _this.s.dynamicEl[index].poster;
        }

        _html = _this.s.dynamicEl[index].html;
        _src = _this.s.dynamicEl[index].src;
        _alt = _this.s.dynamicEl[index].alt;

        if (_this.s.dynamicEl[index].responsive) {
            var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
            getResponsiveSrc(srcDyItms);
        }

        _srcset = _this.s.dynamicEl[index].srcset;
        _sizes = _this.s.dynamicEl[index].sizes;

    } else {

        if (_this.items[index].getAttribute('data-poster')) {
            _hasPoster = true;
            _poster = _this.items[index].getAttribute('data-poster');
        }

        _html = _this.items[index].getAttribute('data-html');
        _src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');
        _alt = _this.items[index].getAttribute('title');

        if (_this.items[index].querySelector('img')) {
            _alt = _alt || _this.items[index].querySelector('img').getAttribute('alt');
        }

        if (_this.items[index].getAttribute('data-responsive')) {
            var srcItms = _this.items[index].getAttribute('data-responsive').split(',');
            getResponsiveSrc(srcItms);
        }

        _srcset = _this.items[index].getAttribute('data-srcset');
        _sizes = _this.items[index].getAttribute('data-sizes');

    }

    var iframe = false;
    if (_this.s.dynamic) {
        if (_this.s.dynamicEl[index].iframe) {
            iframe = true;
        }
    } else {
        if (_this.items[index].getAttribute('data-iframe') === 'true') {
            iframe = true;
        }
    }

    var _isVideo = _this.isVideo(_src, index);
    if (!utils.hasClass(_this.___slide[index], 'lg-loaded')) {
        if (iframe) {
            _this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
        } else if (_hasPoster) {
            var videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            } else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            } else {
                videoClass = 'lg-has-html5';
            }

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

        } else if (_isVideo) {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
            utils.trigger(_this.el, 'hasVideo', {
                index: index,
                src: _src,
                html: _html
            });
        } else {
            _alt = _alt ? 'alt="' + _alt + '"' : '';
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" ' + _alt + ' src="' + _src + '" /></div>');
        }

        utils.trigger(_this.el, 'onAferAppendSlide', {
            index: index
        });

        _img = _this.___slide[index].querySelector('.lg-object');
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
            _this.addHtml(index);
        }

        utils.addClass(_this.___slide[index], 'lg-loaded');
    }

    utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {

        var _speed = 0;

        if (delay && !utils.hasClass(document.body, 'lg-from-hash')) {
            _speed = delay;
        }

        setTimeout(function() {
            utils.addClass(_this.___slide[index], 'lg-complete');

            utils.trigger(_this.el, 'onSlideItemLoad', {
                index: index,
                delay: delay || 0
            });
        }, _speed);

    });

    if (_isVideo && _isVideo.html5 && !_hasPoster) {
        utils.addClass(_this.___slide[index], 'lg-complete');
    }

    if (rec === true) {
        if (!utils.hasClass(_this.___slide[index], 'lg-complete')) {
            utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {
                _this.preload(index);
            });
        } else {
            _this.preload(index);
        }
    }
};

Plugin.prototype.slide = function(index, fromTouch, fromThumb) {

    var _prevIndex = 0;
    for (var i = 0; i < this.___slide.length; i++) {
        if (utils.hasClass(this.___slide[i], 'lg-current')) {
            _prevIndex = i;
            break;
        }
    }

    var _this = this;

    // Prevent if multiple call
    // Required for hsh plugin
    if (_this.lGalleryOn && (_prevIndex === index)) {
        return;
    }

    var _length = this.___slide.length;
    var _time = _this.lGalleryOn ? this.s.speed : 0;
    var _next = false;
    var _prev = false;

    if (!_this.lgBusy) {

        if (this.s.download) {
            var _src;
            if (_this.s.dynamic) {
                _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
            } else {
                _src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));

            }

            if (_src) {
                document.getElementById('lg-download').setAttribute('href', _src);
                utils.removeClass(_this.outer, 'lg-hide-download');
            } else {
                utils.addClass(_this.outer, 'lg-hide-download');
            }
        }

        utils.trigger(_this.el, 'onBeforeSlide', {
            prevIndex: _prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
        });

        _this.lgBusy = true;

        clearTimeout(_this.hideBartimeout);

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            setTimeout(function() {
                _this.addHtml(index);
            }, _time);
        }

        this.arrowDisable(index);

        if (!fromTouch) {

            // remove all transitions
            utils.addClass(_this.outer, 'lg-no-trans');

            for (var j = 0; j < this.___slide.length; j++) {
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

                //prevslide
                utils.addClass(this.___slide[index], 'lg-prev-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-next-slide');
            } else if (_next) {

                // next slide
                utils.addClass(this.___slide[index], 'lg-next-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
            }

            // give 50 ms for browser to add/remove class
            setTimeout(function() {
                utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');

                //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                utils.addClass(_this.___slide[index], 'lg-current');

                // reset all transitions
                utils.removeClass(_this.outer, 'lg-no-trans');
            }, 50);
        } else {

            var touchPrev = index - 1;
            var touchNext = index + 1;

            if ((index === 0) && (_prevIndex === _length - 1)) {

                // next slide
                touchNext = 0;
                touchPrev = _length - 1;
            } else if ((index === _length - 1) && (_prevIndex === 0)) {

                // prev slide
                touchNext = 0;
                touchPrev = _length - 1;
            }

            utils.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
            utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
            utils.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
            utils.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
            utils.addClass(_this.___slide[touchNext], 'lg-next-slide');
            utils.addClass(_this.___slide[index], 'lg-current');
        }

        if (_this.lGalleryOn) {
            setTimeout(function() {
                _this.loadContent(index, true, 0);
            }, this.s.speed + 50);

            setTimeout(function() {
                _this.lgBusy = false;
                utils.trigger(_this.el, 'onAfterSlide', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb
                });
            }, this.s.speed);

        } else {
            _this.loadContent(index, true, _this.s.backdropDuration);

            _this.lgBusy = false;
            utils.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });
        }

        _this.lGalleryOn = true;

        if (this.s.counter) {
            if (document.getElementById('lg-counter-current')) {
                document.getElementById('lg-counter-current').innerHTML = index + 1;
            }
        }

    }

};

/**
 *  @desc Go to next slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */
Plugin.prototype.goToNextSlide = function(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if ((_this.index + 1) < _this.___slide.length) {
            _this.index++;
            utils.trigger(_this.el, 'onBeforeNextSlide', {
                index: _this.index
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = 0;
                utils.trigger(_this.el, 'onBeforeNextSlide', {
                    index: _this.index
                });
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-right-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-right-end');
                }, 400);
            }
        }
    }
};

/**
 *  @desc Go to previous slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */
Plugin.prototype.goToPrevSlide = function(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if (_this.index > 0) {
            _this.index--;
            utils.trigger(_this.el, 'onBeforePrevSlide', {
                index: _this.index,
                fromTouch: fromTouch
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = _this.items.length - 1;
                utils.trigger(_this.el, 'onBeforePrevSlide', {
                    index: _this.index,
                    fromTouch: fromTouch
                });
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-left-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-left-end');
                }, 400);
            }
        }
    }
};

Plugin.prototype.keyPress = function() {
    var _this = this;
    if (this.items.length > 1) {
        utils.on(window, 'keyup.lg', function(e) {
            if (_this.items.length > 1) {
                if (e.keyCode === 37) {
                    e.preventDefault();
                    _this.goToPrevSlide();
                }

                if (e.keyCode === 39) {
                    e.preventDefault();
                    _this.goToNextSlide();
                }
            }
        });
    }

    utils.on(window, 'keydown.lg', function(e) {
        if (_this.s.escKey === true && e.keyCode === 27) {
            e.preventDefault();
            if (!utils.hasClass(_this.outer, 'lg-thumb-open')) {
                _this.destroy();
            } else {
                utils.removeClass(_this.outer, 'lg-thumb-open');
            }
        }
    });
};

Plugin.prototype.arrow = function() {
    var _this = this;
    utils.on(this.outer.querySelector('.lg-prev'), 'click.lg', function() {
        _this.goToPrevSlide();
    });

    utils.on(this.outer.querySelector('.lg-next'), 'click.lg', function() {
        _this.goToNextSlide();
    });
};

Plugin.prototype.arrowDisable = function(index) {

    // Disable arrows if s.hideControlOnEnd is true
    if (!this.s.loop && this.s.hideControlOnEnd) {
        let next = this.outer.querySelector('.lg-next');
        let prev = this.outer.querySelector('.lg-prev');
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
};

Plugin.prototype.setTranslate = function(el, xValue, yValue) {
    // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
    if (this.s.useLeft) {
        el.style.left = xValue;
    } else {
        utils.setVendor(el, 'Transform', 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)');
    }
};

Plugin.prototype.touchMove = function(startCoords, endCoords) {

    var distance = endCoords - startCoords;

    if (Math.abs(distance) > 15) {
        // reset opacity and transition duration
        utils.addClass(this.outer, 'lg-dragging');

        // move current slide
        this.setTranslate(this.___slide[this.index], distance, 0);

        // move next and prev slide with current slide
        this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
        this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
    }
};

Plugin.prototype.touchEnd = function(distance) {
    var _this = this;

    // keep slide animation for any mode while dragg/swipe
    if (_this.s.mode !== 'lg-slide') {
        utils.addClass(_this.outer, 'lg-slide');
    }

    for (var i = 0; i < this.___slide.length; i++) {
        if (!utils.hasClass(this.___slide[i], 'lg-current') && !utils.hasClass(this.___slide[i], 'lg-prev-slide') && !utils.hasClass(this.___slide[i], 'lg-next-slide')) {
            this.___slide[i].style.opacity = '0';
        }
    }

    // set transition duration
    setTimeout(function() {
        utils.removeClass(_this.outer, 'lg-dragging');
        if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToNextSlide(true);
        } else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToPrevSlide(true);
        } else if (Math.abs(distance) < 5) {

            // Trigger click if distance is less than 5 pix
            utils.trigger(_this.el, 'onSlideClick');
        }

        for (var i = 0; i < _this.___slide.length; i++) {
            _this.___slide[i].removeAttribute('style');
        }
    });

    // remove slide class once drag/swipe is completed if mode is not slide
    setTimeout(function() {
        if (!utils.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
            utils.removeClass(_this.outer, 'lg-slide');
        }
    }, _this.s.speed + 100);

};

Plugin.prototype.enableSwipe = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isMoved = false;

    if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {

        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'touchstart.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
                    e.preventDefault();
                    _this.manageSwipeClass();
                    startCoords = e.targetTouches[0].pageX;
                }
            });
        }

        for (var j = 0; j < _this.___slide.length; j++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[j], 'touchmove.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    e.preventDefault();
                    endCoords = e.targetTouches[0].pageX;
                    _this.touchMove(startCoords, endCoords);
                    isMoved = true;
                }
            });
        }

        for (var k = 0; k < _this.___slide.length; k++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[k], 'touchend.lg', function() {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords - startCoords);
                    } else {
                        utils.trigger(_this.el, 'onSlideClick');
                    }
                }
            });
        }
    }

};

Plugin.prototype.enableDrag = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isDraging = false;
    var isMoved = false;
    if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'mousedown.lg', function(e) {
                // execute only on .lg-object
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                        e.preventDefault();

                        if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = e.pageX;
                            isDraging = true;

                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.outer.scrollLeft += 1;
                            _this.outer.scrollLeft -= 1;

                            // *

                            utils.removeClass(_this.outer, 'lg-grab');
                            utils.addClass(_this.outer, 'lg-grabbing');

                            utils.trigger(_this.el, 'onDragstart');
                        }

                    }
                }
            });
        }

        utils.on(window, 'mousemove.lg', function(e) {
            if (isDraging) {
                isMoved = true;
                endCoords = e.pageX;
                _this.touchMove(startCoords, endCoords);
                utils.trigger(_this.el, 'onDragmove');
            }
        });

        utils.on(window, 'mouseup.lg', function(e) {
            if (isMoved) {
                isMoved = false;
                _this.touchEnd(endCoords - startCoords);
                utils.trigger(_this.el, 'onDragend');
            } else if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                utils.trigger(_this.el, 'onSlideClick');
            }

            // Prevent execution on click
            if (isDraging) {
                isDraging = false;
                utils.removeClass(_this.outer, 'lg-grabbing');
                utils.addClass(_this.outer, 'lg-grab');
            }
        });

    }
};

Plugin.prototype.manageSwipeClass = function() {
    var touchNext = this.index + 1;
    var touchPrev = this.index - 1;
    var length = this.___slide.length;
    if (this.s.loop) {
        if (this.index === 0) {
            touchPrev = length - 1;
        } else if (this.index === length - 1) {
            touchNext = 0;
        }
    }

    for (var i = 0; i < this.___slide.length; i++) {
        utils.removeClass(this.___slide[i], 'lg-next-slide');
        utils.removeClass(this.___slide[i], 'lg-prev-slide');
    }

    if (touchPrev > -1) {
        utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
    }

    utils.addClass(this.___slide[touchNext], 'lg-next-slide');
};

Plugin.prototype.mousewheel = function() {
    var _this = this;
    utils.on(_this.outer, 'mousewheel.lg', function(e) {

        if (!e.deltaY) {
            return;
        }

        if (e.deltaY > 0) {
            _this.goToPrevSlide();
        } else {
            _this.goToNextSlide();
        }

        e.preventDefault();
    });

};

Plugin.prototype.closeGallery = function() {

    var _this = this;
    var mousedown = false;
    utils.on(this.outer.querySelector('.lg-close'), 'click.lg', function() {
        _this.destroy();
    });

    if (_this.s.closable) {

        // If you drag the slide and release outside gallery gets close on chrome
        // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
        utils.on(_this.outer, 'mousedown.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap')) {
                mousedown = true;
            } else {
                mousedown = false;
            }

        });

        utils.on(_this.outer, 'mouseup.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap') && mousedown) {
                if (!utils.hasClass(_this.outer, 'lg-dragging')) {
                    _this.destroy();
                }
            }

        });

    }

};

Plugin.prototype.destroy = function(d) {

    var _this = this;

    if (!d) {
        utils.trigger(_this.el, 'onBeforeClose');
    }

    document.body.scrollTop = _this.prevScrollTop;
    document.documentElement.scrollTop = _this.prevScrollTop;

    /**
     * if d is false or undefined destroy will only close the gallery
     * plugins instance remains with the element
     *
     * if d is true destroy will completely remove the plugin
     */

    if (d) {
        if (!_this.s.dynamic) {
            // only when not using dynamic mode is $items a jquery collection

            for (var i = 0; i < this.items.length; i++) {
                utils.off(this.items[i], '.lg');
                utils.off(this.items[i], '.lgcustom');
            }
        }

        let lguid = _this.el.getAttribute('lg-uid');
        delete window.lgData[lguid];
        _this.el.removeAttribute('lg-uid');
    }

    // Unbind all events added by lightGallery
    utils.off(this.el, '.lgtm');

    // Distroy all lightGallery modules
    for (var key in window.lgModules) {
        if (_this.modules[key]) {
            _this.modules[key].destroy(d);
        }
    }

    this.lGalleryOn = false;

    clearTimeout(_this.hideBartimeout);
    this.hideBartimeout = false;
    utils.off(window, '.lg');
    utils.removeClass(document.body, 'lg-on');
    utils.removeClass(document.body, 'lg-from-hash');

    if (_this.outer) {
        utils.removeClass(_this.outer, 'lg-visible');
    }

    utils.removeClass(document.querySelector('.lg-backdrop'), 'in');
    setTimeout(function() {
        try {
            if (_this.outer) {
                _this.outer.parentNode.removeChild(_this.outer);
            }

            if (document.querySelector('.lg-backdrop')) {
                document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
            }

            if (!d) {
                utils.trigger(_this.el, 'onCloseAfter');
            }
            _this.el.focus();
        } catch (err) {}

    }, _this.s.backdropDuration + 50);
};

function lightGallery(el, options) {
    if (!el) {
        return;
    }

    try {
        if (!el.getAttribute('lg-uid')) {
            let uid = 'lg' + window.lgData.uid++;
            window.lgData[uid] = new Plugin(el, options);
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
                counter: false,
                width: '1200px',
                height: '600px',
            });
        });
    }

    static initOnLoad() {
        document.addEventListener('DOMContentLoaded', this.init);
    }
}

LightGalleryUI.initOnLoad();
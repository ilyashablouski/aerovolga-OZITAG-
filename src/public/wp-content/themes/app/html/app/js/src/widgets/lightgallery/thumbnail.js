const thumbnailDefaults = {
    thumbnail: true,
    animateThumb: false,
    currentPagerPosition: 'middle',
    thumbWidth: 100,
    thumbContHeight: 100,
    thumbMargin: 5,
    exThumbImage: false,
    showThumbByDefault: false,
    toggleThumb: false,
    pullCaptionUp: false,
    enableThumbDrag: false,
    enableThumbSwipe: false,
    swipeThreshold: 50,
    loadYoutubeThumbnail: false,
    youtubeThumbSize: 1,
    loadVimeoThumbnail: false,
    vimeoThumbSize: 'thumbnail_small',
    loadDailymotionThumbnail: false,
};

class Thumbnail {
    constructor(element) {
        this.el = element;

        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = Object.assign({}, thumbnailDefaults, this.core.s);

        this.thumbOuter = null;
        this.thumbOuterWidth = 0;
        this.thumbTotalWidth = (this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin));
        this.thumbIndex = this.core.index;

        this.left = 0;

        this.init();
    }

    init() {
        if (this.core.s.thumbnail && this.core.items.length > 1) {
            if (this.core.s.showThumbByDefault) {
                setTimeout(() => {
                    utils.addClass(this.core.outer, 'lg-thumb-open');
                }, 700);
            }

            if (this.core.s.pullCaptionUp) {
                utils.addClass(this.core.outer, 'lg-pull-caption-up');
            }

            this.build();
            if (this.core.s.animateThumb) {
                if (this.core.s.enableThumbDrag && !this.core.isTouch && this.core.doCss()) {
                    this.enableThumbDrag();
                }

                if (this.core.s.enableThumbSwipe && this.core.isTouch && this.core.doCss()) {
                    this.enableThumbSwipe();
                }

                this.thumbClickable = false;
            } else {
                this.thumbClickable = true;
            }

            this.toggle();
            this.thumbkeyPress();
        }
    }

    build() {
        let thumbList = '';
        let vimeoErrorThumbSize = '';
        let $thumb;
        let html = `
            <div class="lg-thumb-outer">
                <div class="lg-thumb group"></div>
            </div>
        `;

        switch (this.core.s.vimeoThumbSize) {
            case 'thumbnail_large':
                vimeoErrorThumbSize = '640';
                break;
            case 'thumbnail_medium':
                vimeoErrorThumbSize = '200x150';
                break;
            case 'thumbnail_small':
                vimeoErrorThumbSize = '100x75';
        }

        utils.addClass(this.core.outer, 'lg-has-thumb');

        this.core.outer.querySelector('.lg').insertAdjacentHTML('afterbegin', html);

        this.thumbOuter = this.core.outer.querySelector('.lg-thumb-outer');
        this.thumbOuterWidth = this.thumbOuter.offsetWidth;

        if (this.core.s.animateThumb) {
            this.core.outer.querySelector('.lg-thumb').style.width = this.thumbTotalWidth + 'px';
            this.core.outer.querySelector('.lg-thumb').style.position = 'relative';
        }

        if (this.core.s.animateThumb) {
            this.thumbOuter.style.height = this.core.s.thumbContHeight + 'px';
        }

        const getThumb = (src, thumb, index) => {
            const isVideo = this.core.isVideo(src, index) || {};
            let thumbImg;
            let vimeoId = '';

            if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) {
                if (isVideo.youtube) {
                    if (this.core.s.loadYoutubeThumbnail) {
                        thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + this.core.s.youtubeThumbSize + '.jpg';
                    } else {
                        thumbImg = thumb;
                    }
                } else if (isVideo.vimeo) {
                    if (this.core.s.loadVimeoThumbnail) {
                        thumbImg = '//i.vimeocdn.com/video/error_' + vimeoErrorThumbSize + '.jpg';
                        vimeoId = isVideo.vimeo[1];
                    } else {
                        thumbImg = thumb;
                    }
                } else if (isVideo.dailymotion) {
                    if (this.core.s.loadDailymotionThumbnail) {
                        thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
                    } else {
                        thumbImg = thumb;
                    }
                }
            } else {
                thumbImg = thumb;
            }

            // thumbList += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + this.core.s.thumbWidth + 'px; margin-right: ' + this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
            thumbList += `<div class="lg-thumb-item"><img src="${thumbImg}"/></div>`;
            vimeoId = '';
        }

        if (this.core.s.dynamic) {
            for (let j = 0; j < this.core.s.dynamicEl.length; j++) {
                getThumb(this.core.s.dynamicEl[j].src, this.core.s.dynamicEl[j].thumb, j);
            }
        } else {
            for (let i = 0; i < this.core.items.length; i++) {
                if (!this.core.s.exThumbImage) {
                    getThumb(this.core.items[i].getAttribute('href') || this.core.items[i].getAttribute('data-src'), this.core.items[i].querySelector('img').getAttribute('src'), i);
                } else {
                    getThumb(this.core.items[i].getAttribute('href') || this.core.items[i].getAttribute('data-src'), this.core.items[i].getAttribute(this.core.s.exThumbImage), i);
                }
            }
        }

        this.core.outer.querySelector('.lg-thumb').innerHTML = thumbList;

        $thumb = this.core.outer.querySelectorAll('.lg-thumb-item');

        for (let n = 0; n < $thumb.length; n++) {
            ((index) => {
                const $this = $thumb[index];

                const _img = $this.querySelector('img');
                const _imgOffsetWidth = _img.offsetWidth
                const _imgOffsetHeight = _img.offsetHeight

                if (_imgOffsetWidth > _imgOffsetHeight) {
                    utils.addClass($this, 'lg-thumb-horizontal');
                }

                const vimeoVideoId = $this.getAttribute('data-vimeo-id');
                if (vimeoVideoId) {
                    window['lgJsonP' + this.el.getAttribute('lg-uid') + '' + n] = (content) => {
                        $this.querySelector('img').setAttribute('src', content[0][this.core.s.vimeoThumbSize]);
                    };

                    const script = document.createElement('script');
                    script.className = 'lg-script';
                    script.src = '//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=lgJsonP' + this.el.getAttribute('lg-uid') + '' + n;
                    document.body.appendChild(script);
                }
            })(n);
        }

        utils.addClass($thumb[this.core.index], 'active');
        utils.on(this.core.el, 'onBeforeSlide.lgtm', () => {
            for (let j = 0; j < $thumb.length; j++) {
                utils.removeClass($thumb[j], 'active');
            }

            utils.addClass($thumb[this.core.index], 'active');
        });

        for (let k = 0; k < $thumb.length; k++) {
            ((index) => {
                utils.on($thumb[index], 'click.lg touchend.lg', () => {
                    setTimeout(() => {
                        if ((this.thumbClickable && !this.core.lgBusy) || !this.core.doCss()) {
                            this.core.index = index;
                            this.core.slide(this.core.index, false, true);
                        }
                    }, 50);
                });
            })(k);
        }

        utils.on(this.core.el, 'onBeforeSlide.lgtm', () => {
            this.animateThumb(this.core.index);
        });

        utils.on(window, 'resize.lgthumb orientationchange.lgthumb', () => {
            setTimeout(() => {
                this.animateThumb(this.core.index);
                this.thumbOuterWidth = this.thumbOuter.offsetWidth;
            }, 200);
        });
    }

    setTranslate(value) {
        utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'Transform', 'translate3d(-' + (value) + 'px, 0px, 0px)');
    }

    animateThumb(index) {
        const $thumb = this.core.outer.querySelector('.lg-thumb');
    
        if (this.core.s.animateThumb) {
            let position;
            switch (this.core.s.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = (this.thumbOuterWidth / 2) - (this.core.s.thumbWidth / 2);
                    break;
                case 'right':
                    position = this.thumbOuterWidth - this.core.s.thumbWidth;
            }
            this.left = ((this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1) - position;
            if (this.left > (this.thumbTotalWidth - this.thumbOuterWidth)) {
                this.left = this.thumbTotalWidth - this.thumbOuterWidth;
            }

            if (this.left < 0) {
                this.left = 0;
            }

            if (this.core.lGalleryOn) {
                if (!utils.hasClass($thumb, 'on')) {
                    utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'TransitionDuration', this.core.s.speed + 'ms');
                }

                if (!this.core.doCss()) {
                    $thumb.style.left = -this.left + 'px';
                }
            } else {
                if (!this.core.doCss()) {
                    $thumb.style.left = -this.left + 'px';
                }
            }

            this.setTranslate(this.left);
        }
    }

    enableThumbDrag() {
        let startCoords = 0;
        let endCoords = 0;
        let isDraging = false;
        let isMoved = false;
        let tempLeft = 0;

        utils.addClass(this.thumbOuter, 'lg-grab');

        utils.on(this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb', (e) => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                e.preventDefault();
                startCoords = e.pageX;
                isDraging = true;

                this.core.outer.scrollLeft += 1;
                this.core.outer.scrollLeft -= 1;

                this.thumbClickable = false;
                utils.removeClass(this.thumbOuter, 'lg-grab');
                utils.addClass(this.thumbOuter, 'lg-grabbing');
            }
        });

        utils.on(window, 'mousemove.lgthumb', (e) => {
            if (isDraging) {
                tempLeft = this.left;
                isMoved = true;
                endCoords = e.pageX;

                utils.addClass(this.thumbOuter, 'lg-dragging');

                tempLeft = tempLeft - (endCoords - startCoords);

                if (tempLeft > (this.thumbTotalWidth - this.thumbOuterWidth)) {
                    tempLeft = this.thumbTotalWidth - this.thumbOuterWidth;
                }

                if (tempLeft < 0) {
                    tempLeft = 0;
                }

                this.setTranslate(tempLeft);
            }
        });

        utils.on(window, 'mouseup.lgthumb', () => {
            if (isMoved) {
                isMoved = false;
                utils.removeClass(this.thumbOuter, 'lg-dragging');

                this.left = tempLeft;

                if (Math.abs(endCoords - startCoords) < this.core.s.swipeThreshold) {
                    this.thumbClickable = true;
                }
            } else {
                this.thumbClickable = true;
            }

            if (isDraging) {
                isDraging = false;
                utils.removeClass(this.thumbOuter, 'lg-grabbing');
                utils.addClass(this.thumbOuter, 'lg-grab');
            }
        });
    }

    enableThumbSwipe() {
        let startCoords = 0;
        let endCoords = 0;
        let isMoved = false;
        let tempLeft = 0;

        utils.on(this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg', (e) => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                e.preventDefault();
                startCoords = e.targetTouches[0].pageX;
                this.thumbClickable = false;
            }
        });

        utils.on(this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg', (e) => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                e.preventDefault();
                endCoords = e.targetTouches[0].pageX;
                isMoved = true;

                utils.addClass(this.thumbOuter, 'lg-dragging');

                tempLeft = this.left;

                tempLeft = tempLeft - (endCoords - startCoords);

                if (tempLeft > (this.thumbTotalWidth - this.thumbOuterWidth)) {
                    tempLeft = this.thumbTotalWidth - this.thumbOuterWidth;
                }

                if (tempLeft < 0) {
                    tempLeft = 0;
                }

                this.setTranslate(tempLeft);
            }
        });

        utils.on(this.core.outer.querySelector('.lg-thumb'), 'touchend.lg', () => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                if (isMoved) {
                    isMoved = false;
                    utils.removeClass(this.thumbOuter, 'lg-dragging');
                    if (Math.abs(endCoords - startCoords) < this.core.s.swipeThreshold) {
                        this.thumbClickable = true;
                    }

                    this.left = tempLeft;
                } else {
                    this.thumbClickable = true;
                }
            } else {
                this.thumbClickable = true;
            }
        });
    }

    toggle() {
        if (this.core.s.toggleThumb) {
            utils.addClass(this.core.outer, 'lg-can-toggle');
            this.thumbOuter.insertAdjacentHTML('beforeend', '<button type="button" class="lg-toggle-thumb lg-icon"></button>');
            utils.on(this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg', () => {
                if (utils.hasClass(this.core.outer, 'lg-thumb-open')) {
                    utils.removeClass(this.core.outer, 'lg-thumb-open');
                } else {
                    utils.addClass(this.core.outer, 'lg-thumb-open');
                }
            });
        }
    }

    thumbkeyPress() {
        utils.on(window, 'keydown.lgthumb', (e) => {
            if (e.keyCode === 38) {
                e.preventDefault();
                utils.addClass(this.core.outer, 'lg-thumb-open');
            } else if (e.keyCode === 40) {
                e.preventDefault();
                utils.removeClass(this.core.outer, 'lg-thumb-open');
            }
        });
    }

    destroy(d) {
        if (this.core.s.thumbnail && this.core.items.length > 1) {
            utils.off(window, '.lgthumb');
            if (!d) {
                this.thumbOuter.parentNode.removeChild(this.thumbOuter);
            }
            utils.removeClass(this.core.outer, 'lg-has-thumb');

            const lgScript = document.getElementsByClassName('lg-script');
            while (lgScript[0]) {
                lgScript[0].parentNode.removeChild(lgScript[0]);
            }
        }
    }
};

export { Thumbnail }
export default Thumbnail;
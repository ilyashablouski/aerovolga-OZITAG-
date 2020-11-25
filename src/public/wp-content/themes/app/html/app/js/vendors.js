import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';
import 'intersection-observer';
import './polyfills';
import 'html5shiv';
import 'picturefill';
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/native-loading/ls.native-loading';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import svgPolyfill from 'svg4everybody';
import jquery from 'jquery';
import Swiper, { Navigation, Pagination, Thumbs, Autoplay } from 'swiper';
import PerfectScrollbar from 'perfect-scrollbar';
import select2 from 'select2';
import barba from '@barba/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

window.$ = window.jQuery = jquery;
window.svg4everybody = svgPolyfill;

window.Swiper = Swiper;
Swiper.use([Navigation, Pagination, Thumbs, Autoplay]);

window.select2 = select2;
window.PerfectScrollbar = PerfectScrollbar;

window.barba = barba;
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};

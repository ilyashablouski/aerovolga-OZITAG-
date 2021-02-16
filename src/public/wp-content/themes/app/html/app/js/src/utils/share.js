const shareList = {
  vk: (purl, ptitle, pimg, text) => {
    let url = 'http://vkontakte.ru/share.php?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&image=' + encodeURIComponent(pimg);
    url += '&noparse=true';
    Share.popup(url);
  },
  ok: (purl, ptitle, pimg, text) => {
    let url = 'https://connect.ok.ru/offer?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&imageUrl=' + encodeURIComponent(pimg);
    Share.popup(url);
  },
  fb: (purl, ptitle, pimg, text) => {
    let url = 'http://www.facebook.com/sharer.php?s=100';
    url += '&p[title]=' + encodeURIComponent(ptitle);
    url += '&p[summary]=' + encodeURIComponent(text);
    url += '&p[url]=' + encodeURIComponent(purl);
    url += '&p[images][0]=' + encodeURIComponent(pimg);
    Share.popup('https://www.facebook.com/sharer/sharer.php?u=' + purl);
  },
  tw: (purl, ptitle, pimg, text) => {
    let url = 'http://twitter.com/share?';
    if (typeof ptitle !== 'undefined') {
      url += 'text=' + encodeURIComponent(ptitle.length ? ptitle : text);
    }
    url += '&url=' + encodeURIComponent(purl);
    url += '&counturl=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  popup: url => {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  },
};


class Share extends Widget {
  constructor(node) {
    super(node, '.js-share');

    this.$socialList = this.$node.querySelectorAll('.js-social-share');

    this.init();
  }

  build() {
    this.$socialList.forEach((social) => {
      social.addEventListener('click', (e) => this.socialBtnClick(e));
    });
  }

  destroy() {
    this.$socialList.forEach((social) => {
      social.removeEventListener('click', (e) => this.socialBtnClick(e));
    });
  }

  getOgParam (param) {
  const elem = document.querySelector('meta[property="og:' + param + '"]');
  return elem && elem.content || '';
}

  socialBtnClick(e) {
    e.preventDefault();

    const { currentTarget } = e;
    const socialName = currentTarget.dataset.social;
    const handler =  shareList[socialName] || null;

    if (handler === null) return false;

    handler(
      this.getOgParam('url'),
      this.getOgParam('title'),
      this.getOgParam('description'),
      this.getOgParam('image'),
    );
  }

  static init(el) {
    new Share(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-share').forEach(item => Share.init(item));
});

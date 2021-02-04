class APIManager {
  static createURL(apiUrl, options) {
    const [pathname, search] = apiUrl.split('?');
    const params = new URLSearchParams(search);

    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        params.set(key, options[key]);
      }
    }

    return pathname + "?" + params.toString();
  }

  static getAPI({ type, apiUrl, params = {} }) {
    const url = APIManager.createURL(apiUrl, params);
    let request = null;

    switch (type) {
      case 'css':
        request = APIManager.loaderCss(url);
        break;
      case 'js':
        request = APIManager.loaderJs(url);
        break;
    }

    return new Promise((resolve) => {
      request.addEventListener('load', () => resolve());
      document.head.appendChild(request);
    });
  }

  static loaderJs(url) {
    const script = document.createElement('script');

    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;

    return script;
  }

  static loaderCss(url) {
    const link = document.createElement('link');

    link.href = url;
    link.type = 'text/css';
    link.rel = 'stylesheet';

    return link;
  }
}

window.getAPI = APIManager.getAPI;
window.createURL = APIManager.createURL;

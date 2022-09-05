module GeneralUtils {
  export function createPromise(): PromiseInterface {
    let resolve: any;
    let reject: any;

    const promise = new Promise((thisResolve: Function, thisReject: Function) => {
      resolve = thisResolve;
      reject = thisReject;
    });

    return Object.assign(promise, { resolve, reject });
  }

  /**
   * Appends parameter(s) to a URL.
   */
  export function addUrlParameters(url: string, params: string | string[]): string {
    const concatenated = Array.isArray(params) ? params.join('&') : params;
    if (concatenated.length === 0) {
      return url;
    }
    url = url.replace(/\?$/, '');
    return url + (url.indexOf('?') === -1 ? '?' : '&') + concatenated;
  }

  export function getPathToResources(visualization: string, rootPath: string) {
    switch (visualization) {
      case 'map':
        return `${rootPath}@nebula.js/sn-map/dist`;
      case 'sn-map':
      default:
        return `${rootPath}extensions/sn-map`;
    }
  }
}

export default GeneralUtils;

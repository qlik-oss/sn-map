import Utils from '../../../../../utils/general';
import WMSCapabilities from './wms-capabilities';

module WMSUtils {
  export function getWMSCapabilities(url: string, version: string) {
    const axios = require('axios');
    const promise = Utils.createPromise();
    const getUrl = Utils.addUrlParameters(url, `service=wms&version=${version}&request=GetCapabilities`);
    axios
      .get(getUrl, { timeout: 60000 })
      .then(function (doc: any) {
        const capabilities = new WMSCapabilities(doc.data);
        if (capabilities.formats.length > 0 && capabilities.srs.length > 0) {
          promise.resolve(capabilities as any);
        } else {
          promise.reject();
        }
      })
      .catch(function () {
        promise.reject();
      });

    return promise;
  }
}

export default WMSUtils;

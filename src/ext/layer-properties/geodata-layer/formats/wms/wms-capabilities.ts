import WMSLayer from './wms-layer';

/**
 * Class that parse a xml document to extract wms capabilites (layers, image formats and srs)
 */
class WMSCapabilities {
  formats: string[];
  srs: string[];
  layers: WMSLayer[];

  constructor(data: Document | string) {
    let xmlDoc = data;
    // Check if DOM object
    if (typeof data === 'string' && (data as any).nodeName !== '#document') {
      xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
    }
    this.formats = this.parseFormats(xmlDoc as Document);
    this.srs = this.parseSrs(xmlDoc as Document);
    this.layers = this.parseLayers(xmlDoc as Document);
  }

  private parseFormats(xmlDoc: Document) {
    const wmsFormats: string[] = [];
    const getMap = xmlDoc.getElementsByTagName('GetMap');
    for (let i = 0; i < getMap.length; i++) {
      const formats = this.selector(getMap[i], ['Format']);
      for (let j = 0; j < formats.length; j++) {
        const format = formats[j].textContent;
        if (format !== null) {
          wmsFormats.push(format);
        }
      }
    }
    return wmsFormats;
  }

  private parseSrs(xmlDoc: Document) {
    let wmsSrs: string[] = [];
    const layers = xmlDoc.getElementsByTagName('Layer');
    if (layers.length > 0) {
      const srsArr = this.selector(layers[0], ['CRS', 'SRS']);
      for (let i = 0; i < srsArr.length; i++) {
        const srs = srsArr[i].textContent;
        if (srs !== null) {
          wmsSrs = srs.split(' ').concat(wmsSrs);
        }
      }
    }
    return wmsSrs;
  }

  private parseLayers(doc: Document) {
    const wmsLayers: WMSLayer[] = [];
    const layers = doc.getElementsByTagName('Layer');
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const layerName = this.selector(layer, ['Name'])[0]?.textContent || '';
      if (layerName && layerName.length > 0) {
        const wmsLayer = new WMSLayer(layer);
        wmsLayers.push(wmsLayer);
      }
    }

    return wmsLayers;
  }

  private selector(elements: Element, tagSelectors: string[]) {
    return Array.from(elements.children).filter((el) => {
      return tagSelectors.includes(el.tagName);
    });
  }
}

export default WMSCapabilities;

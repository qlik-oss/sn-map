interface LatLonBoundingBox {
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
}

interface BoundingBox {
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;
  resx?: number;
  resy?: number;
  srs: string;
}

/**
 * Class that extract information from a Element element to build up a WMS layer object
 */
class WMSLayer {
  title: string;
  name: string;
  srs: string[];
  crs: string[];
  latLonBoundingBox?: LatLonBoundingBox;
  boundingBox: BoundingBox[];

  constructor(layer: Element) {
    this.name = this.parseName(layer); // Name of the layer
    this.title = this.parseTitle(layer); // Title of the layer
    this.latLonBoundingBox = this.parseLatLonBoundingBox(layer); // latLonBoundingBox (optional);
    this.boundingBox = this.parseBoundingBoxes(layer); // boundingBox
    this.srs = this.parseSRS(layer);
    this.crs = this.parseCRS(layer);
  }

  private parseName(layer: Element) {
    return layer.querySelector('Name')?.textContent || '';
  }

  private parseTitle(layer: Element) {
    return layer.querySelector('Title')?.textContent || '';
  }

  private parseLatLonBoundingBox(layer: Element) {
    const latLonBoxes = this.getAllTag(layer, 'LatLonBoundingBox');
    if (latLonBoxes.length > 0) {
      const llBoxElement = latLonBoxes[0];
      const latLonBox = {
        minx: parseFloat(llBoxElement.getAttribute('minx')),
        maxx: parseFloat(llBoxElement.getAttribute('maxx')),
        miny: parseFloat(llBoxElement.getAttribute('miny')),
        maxy: parseFloat(llBoxElement.getAttribute('maxy')),
      };

      return latLonBox;
    }

    return undefined;
  }

  private parseBoundingBoxes(layer: Element) {
    const bboxTags = this.getAllTag(layer, 'BoundingBox');
    const bboxes: BoundingBox[] = [];
    const bboxSRS: string[] = [];
    for (let i = 0; i < bboxTags.length; i++) {
      const bboxElement = bboxTags[i];
      const srs = bboxElement.getAttribute('SRS');
      const bbox: BoundingBox = {
        srs,
        minx: parseFloat(bboxElement.getAttribute('minx')),
        maxx: parseFloat(bboxElement.getAttribute('maxx')),
        miny: parseFloat(bboxElement.getAttribute('miny')),
        maxy: parseFloat(bboxElement.getAttribute('maxy')),
      };

      const resx = parseFloat(bboxElement.getAttribute('resx'));
      const resy = parseFloat(bboxElement.getAttribute('resy'));
      if (!isNaN(resx)) {
        bbox.resx = resx;
      }
      if (!isNaN(resy)) {
        bbox.resy = resy;
      }

      // No duplcates
      if (!bboxSRS.includes(srs)) {
        bboxes.push(bbox);
        bboxSRS.push(srs);
      }
    }

    return bboxes;
  }

  private parseSRS(layer: Element) {
    const srs: Element[] = this.getAllTag(layer, 'SRS');
    const uniqueSRS: string[] = [];
    for (let i = 0; i < srs.length; i++) {
      const srsText = srs[i].textContent;
      if (srsText !== null && !uniqueSRS.includes(srsText)) {
        uniqueSRS.push(srsText);
      }
    }
    return uniqueSRS; // return only unique SRSs
  }

  private parseCRS(layer: Element) {
    const crs: Element[] = this.getAllTag(layer, 'CRS');
    const uniqueCRS: string[] = [];
    for (let i = 0; i < crs.length; i++) {
      const crsText = crs[i].textContent;
      if (crsText !== null && !uniqueCRS.includes(crsText)) {
        uniqueCRS.push(crsText);
      }
    }
    return uniqueCRS; // return only unique CRSs
  }

  private getAllTag(p: Element, tag: string): any[] {
    return this.getAllRec(p, tag, []);
  }

  private getAllRec(p: Element | null, tag: string, found: any[]): any[] {
    if (p) {
      const children = p.querySelectorAll(tag);
      children.forEach((_e, index) => {
        found.push(children[index]);
      });
      return this.getAllRec(p.parentElement, tag, found);
    } else {
      return found;
    }
  }
}

export default WMSLayer;

export class AttributionModel {
  map: idevio.map.WebMap;
  attributions: { [layerId: string]: string | undefined };

  constructor(map: idevio.map.WebMap) {
    this.map = map;
    this.attributions = {};
  }

  setAttribution(layerId: string, attribution: string) {
    this.attributions[layerId] = attribution;
    this.updateAttribution();
  }

  updateAttribution() {
    const attributions = Object.keys(this.attributions)
      .map((id) => this.attributions[id])
      .filter(Boolean) as string[];
    const reduceAttributions = (acc: string, attribution: string) => {
      return `${acc}, ${attribution}`;
    };
    this.map.setAttribution(attributions.length ? attributions.reduce(reduceAttributions) : null);
  }
}

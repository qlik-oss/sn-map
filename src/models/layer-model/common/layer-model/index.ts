export abstract class LayerModel implements LayerModelInterFace {
  abstract layer: idevio.map.Layer;
  abstract update(layout: GaLayersLayout): void;

  mapModel: MapModelInterFace;
  id: string;
  index: number = -1;

  constructor(mapModel: MapModelInterFace, id: string) {
    this.mapModel = mapModel;
    this.id = id;
  }

  setIndex(index: number) {
    this.index = index;
    if (this.layer) {
      this.layer.setDrawOrder(100 - index);
    }
  }
}

import { LayerModelInterFace } from '../../../../typings/models/layer-model';

export abstract class LayerModel implements LayerModelInterFace {
  abstract layer: idevio.map.Layer;
  abstract update(layout: GaLayersLayout): void;

  mapModel: MapModelInterFace;
  index: number = -1;

  constructor(mapModel: MapModelInterFace) {
    this.mapModel = mapModel;
  }

  setIndex(index: number) {
    this.index = index;
    if (this.layer) {
      this.layer.setDrawOrder(100 - index);
    }
  }
}

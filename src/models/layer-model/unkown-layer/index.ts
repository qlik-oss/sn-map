import { LayerModel } from '../common/layer-model';

/**
 * A layer that is used for unknown layer types.
 */
export class UnknownLayerModel extends LayerModel implements UnknownLayerModelInterface {
  id: string;
  layer!: idevio.map.Layer;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel);
    this.id = id;
  }
  update() {}
  remove() {}
}

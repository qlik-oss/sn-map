import { LayerModel } from '../common/layer-model';

/**
 * A layer that is used for unknown layer types.
 */
export class UnknownLayerModel extends LayerModel implements UnknownLayerModelInterface {
  layer!: idevio.map.Layer;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel, id);
  }
  // TODO: implementation
  update() {}
  remove() {}
}

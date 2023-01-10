import { LayerModel } from '../common/layer-model';
import Formats from './formats';
import { getValue } from 'qlik-chart-modules';

export class GeodataLayerModel extends LayerModel implements GeodataLayerModelInterface {
  layer!: idevio.map.TiledImageLayer | idevio.map.StaticImageLayer;
  dataset!: idevio.map.TiledImageDataset;
  currentUrl: string | undefined;
  currentAttribution: string | undefined;
  oldProps!: TMSProperties | ImageProperties | WMSProperties;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel, id);
  }

  update(layout: GeodataLayerProperties) {
    const dataType = layout.dataType;
    const format = getValue(layout, dataType);
    const attr = getValue(layout, `${dataType}.attribution`);
    this.updateAttributions(attr);

    if (this.havePropsChanged(format, this.oldProps)) {
      this.resetLayer(format);
      switch (dataType) {
        case 'wms':
          this.createWMSLayer(layout);
          break;
        case 'tms':
          this.createTMSLayer(layout);
          break;
        case 'image':
          this.createImageLayer(layout);
          break;
      }
    }
    this.dataset = this.layer.getDataset();

    if (this.layer.setAlpha) {
      this.layer.setAlpha(layout.opacity ?? 1);
    }
  }

  updateAttributions(attribution: string | undefined) {
    if (attribution !== this.currentAttribution) {
      this.currentAttribution = attribution;
      this.mapModel.attributionModel.setAttribution(this.id, (attribution || '').trim());
    }
  }

  resetLayer(props: TMSProperties | ImageProperties | WMSProperties) {
    this.remove();
    this.oldProps = props;
    this.currentUrl = props.url;
  }

  createWMSLayer(layout: GeodataLayerProperties) {
    const projection = this.mapModel.settings.projection;
    const dataset = Formats.getWMSDataset(layout, projection);
    this.layer = new idevio.map.WmsLayer(this.mapModel.map, {
      dataset,
      ...this.getSettings(layout),
    });
  }

  createTMSLayer(layout: GeodataLayerProperties) {
    const projection = this.mapModel.settings.projection;
    const dataset = Formats.getTMSDataset(layout, projection);
    this.layer = new idevio.map.TiledImageLayer(this.mapModel.map, {
      dataset,
      ...this.getSettings(layout),
    });
  }

  createImageLayer(layout: GeodataLayerProperties) {
    const dataset = Formats.getImageDataset(layout);
    this.layer = new idevio.map.StaticImageLayer(this.mapModel.map, {
      dataset,
      ...this.getSettings(layout),
    });
  }

  getSettings(layout: GeodataLayerProperties) {
    return {
      drawOrder: 100 - this.index,
      alpha: layout.opacity ?? 1,
      visible: true,
    };
  }

  havePropsChanged(
    newProps: TMSProperties | ImageProperties | WMSProperties,
    oldProps: TMSProperties | ImageProperties | WMSProperties
  ): boolean {
    return JSON.stringify(newProps) !== JSON.stringify(oldProps);
  }

  remove() {
    if (this.layer) {
      this.layer.remove();
    }
  }
}

import { mergeBoundsArray, getBoundsWidth } from './geo';
import { getValue } from 'qlik-chart-modules';

const mergeBounds = (map: idevio.map.WebMap, layers: GaLayersModelInterface[]): Rectangle | null => {
  const mergeBounds = mergeBoundsArray(collectBounds(layers), map.getWrapLongitude());
  return mergeBounds;
};

const collectBounds = (layers: GaLayersModelInterface[]) => {
  const bounds: Rectangle[] = [];
  layers.forEach((layer: GaLayersModelInterface) => {
    const datasetModel = getValue(layer, 'datasetModel', false);
    if (datasetModel) {
      bounds.push(datasetModel.getBounds());
    }
  });
  return bounds;
};

export const getViewBounds = (map: idevio.map.WebMap, layers: GaLayersModelInterface[]) => {
  let bounds = mergeBounds(map, layers);
  if (bounds) {
    const wrap = map.getWrapLongitude();
    // The boundsScalingCompensation and boundsScaleFactor factors is to compensate for the fact that webmap5 will scale up the bounds it gets.
    // It cancels out the bounds scaling so the bounds will end up unchanged when wbmap5 applies them.
    const boundsScaleFactor = 1.1;
    // Compensate for WM5 scaling of bounds if bounds would show >= whole map width
    if (getBoundsWidth(bounds) * boundsScaleFactor >= 2 * wrap) {
      const boundsScalingCompensation = 0.91;
      const centerLongitude = (bounds.min[1] + bounds.max[1]) / 2;
      bounds = {
        min: [bounds.min[0] * boundsScalingCompensation, (centerLongitude - wrap) * boundsScalingCompensation],
        max: [bounds.max[0] * boundsScalingCompensation, (centerLongitude + wrap) * boundsScalingCompensation],
      };
    }
  }
  return bounds;
};

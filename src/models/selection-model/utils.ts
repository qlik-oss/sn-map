module Utils {
  export function getLayerIndex(feature: idevio.map.Feature, layers: PointLayerModelInterface[]) {
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].datasetModel.dataset === feature.getDataset()) {
        return i;
      }
    }
    return null;
  }

  export function updateSelectedValues(feature: idevio.map.Feature, values: number[]) {
    const row = feature.getAttribute('id');
    if (values.includes(row)) {
      return values.filter((v) => v !== row);
    }
    return [...values, row];
  }

  export function updateSelectedFeatures(feature: idevio.map.Feature, features: idevio.map.Feature[]) {
    const index = features.indexOf(feature);
    if (index === -1) {
      return [feature, ...features];
    } else {
      return features.filter((v) => v !== feature);
    }
  }
}

export default Utils;

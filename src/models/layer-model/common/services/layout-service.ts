import { layoutService as createLayoutService, getValue } from 'qlik-chart-modules';
import Meta from './meta';

declare interface MetaAttributes {
  layout: LayerLayout;
}

module LayoutService {
  export function create(layout: LayerLayout) {
    return createLayoutService({
      source: layout,
      metaAdditionsFn: ({ layout }: MetaAttributes) => {
        const dimensionInfo = getValue(layout, 'qHyperCube.qDimensionInfo', []);
        return {
          attributes: Meta.getAttributesMeta(dimensionInfo),
        };
      },
    });
  }
}

export default LayoutService;

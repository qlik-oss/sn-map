import { layoutService as createLayoutService } from 'qlik-chart-modules';
import Meta from './meta';

declare interface MetaAttributes {
  layout: LayerLayout;
}

module LayoutService {
  export function create(layout: LayerLayout) {
    return createLayoutService({
      source: layout,
      metaAdditionsFn: ({ layout }: MetaAttributes) => {
        return {
          ...Meta.getHyperCubeMeta(layout.qHyperCube),
        };
      },
    });
  }
}

export default LayoutService;

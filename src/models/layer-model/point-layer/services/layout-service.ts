import { layoutService as createLayoutService } from 'qlik-chart-modules';
import Meta from '../../common/services/layout-service/meta';

declare interface MetaAttributes {
  layout: PointLayerLayout;
}

module LayoutService {
  export function create(layout: PointLayerLayout) {
    return createLayoutService({
      source: layout,
      metaAdditionsFn: ({ layout }: MetaAttributes) => {
        return {
          location: Meta.getLocationMeta(layout),
        };
      },
    });
  }
}

export default LayoutService;

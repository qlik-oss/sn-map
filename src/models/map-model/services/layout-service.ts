import { layoutService as createLayoutService } from 'qlik-chart-modules';

module LayoutService {
  export function create(layout: MapLayout) {
    return createLayoutService({
      source: layout,
    });
  }
}

export default LayoutService;

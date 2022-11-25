declare interface LayoutService {
  getDataPages(): NxDataPage[];
  getLayoutValue(path: string): any;
  getLayout(): LayerLayout;
  meta: PointMeta;
}
declare interface ExpressionMeta {
  id: string;
  index: number;
  dimIndex: number;
  isDimension: boolean;
}

declare interface Meta {
  location: LocationMeta;
  metaSize: { expressionMeta: ExpressionMeta };
}

declare interface LocationMeta {
  expressions: ExpressionMeta[];
  isAuto: boolean;
  isLatLong: boolean;
  locationType: string;
}

declare interface PointMeta extends Meta {}

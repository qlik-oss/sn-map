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
  title: string;
  minValue?: number;
  maxValue?: number;
}

declare interface Meta {
  location: LocationMeta;
}

declare interface LocationMeta {
  expressions: ExpressionMeta[];
  isAuto: boolean;
  isLatLong: boolean;
  locationType: string;
}

declare interface PointMeta extends Meta {}

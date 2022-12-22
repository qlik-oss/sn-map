declare interface LayoutService {
  getDataPages(): NxDataPage[];
  getLayoutValue(path: string): any;
  getLayout(): LayerLayout;
  meta: {
    attributes: Meta;
  };
}
declare interface ExpressionMeta {
  index: number;
  dimIndex: number;
  isDimension: boolean;
  title: string;
  minValue?: number;
  maxValue?: number;
}

declare interface Meta {
  geoname?: ExpressionMeta;
  coords?: ExpressionMeta;
  [key: string]: ExpressionMeta;
}

declare interface PointMeta extends Meta {
  size: ExpressionMeta;
}

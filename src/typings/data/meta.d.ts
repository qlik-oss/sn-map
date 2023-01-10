declare interface LayoutService {
  getDataPages(): NxDataPage[];
  getLayoutValue(path: string): any;
  getLayout(): LayerLayout;
  meta: {
    dimensions: DimensionMeta[];
    measures: MeasureMeta[];
    attributes: Meta;
  };
}

declare interface DimensionMeta {
  title: string;
  rowIndex: number;
}

declare interface MeasureMeta {
  title: string;
  rowIndex: number;
  minValue: number;
  maxValue: number;
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
  geoname?: ExpressionMeta;
  coords?: ExpressionMeta;
  size?: ExpressionMeta;
  [key: string]: ExpressionMeta;
}

declare interface NxHyperCubeDef {
  qDimensions: NxDimension[];
  qMeasures: NxMeasure[];
}

declare interface NxDimension {
  qLibraryId: string;
  qDef: NxInlineDimensionDef;
  qAttributeExpressions: NxAttrExprDef[];
  qAttributeDimensions: NxAttrDimDef[];
}

declare interface NxMeasure {
  qLibraryId: string;
  qDef: NxInlineMeasureDef;
}

declare interface NxInlineDimensionDef {
  qFieldDefs: string[];
  cId: string;
  qLabelExpression?: string | undefined;
  qSortCriterias: any[]; // SortCriteria[]
}

declare interface NxInlineMeasureDef {
  cId: string;
  qDef: string;
  qLabel?: string;
}

declare interface NxAttrExprDef {
  id: string; // introduced by us
  qExpression?: string;
  qLibraryId?: string;
  qAttribute?: boolean;
  matchMeasure?: number;
  cId?: string;
  qNumFormat?: any;
  qLabel?: string;
  qLabelExpression?: string | undefined;
}

declare interface NxAttrDimDef {
  id: string; // introduced by us
  qLibraryId?: string;
  qDef?: string;
  qSortBy?: any; // SortCriteria
  qAttribute?: boolean;
}

declare interface NxHyperCube {
  qDataPages: NxDataPage[];
  qDimensionInfo: NxDimensionInfo[];
}

declare interface NxDataPage {
  qMatrix: NxCell[][];
}

declare interface NxCell {
  qText?: string;
  qNum?: number | string;
  qElemNumber: number;
  qState: string;
  qAttrExps?: NxAttributeExpressionValues;
  qAttrDims?: NxAttributeDimValues;
}

declare interface NxAttributeExpressionValues {
  qValues: NxSimpleValue[];
}

declare interface NxSimpleValue {
  qText?: string;
  qNum: number | string;
}

declare interface NxAttributeDimValues {
  qValues: NxSimpleDimValue[];
}

declare interface NxSimpleDimValue {
  qText?: string;
  qElemNo: number;
}

declare interface NxDimensionInfo {
  qFallbackTitle: string;
  qAttrExprInfo: NxAttrExprInfo[];
  qAttrDimInfo: NxAttrDimInfo[];
  qGrouping?: string;
  qError?: string;
  title?: string;
}

declare interface NxAttrExprInfo {
  qMin: number;
  qMax: number;
  qContinuousAxes: boolean;
  qIsCyclic: boolean;
  qIsAutoFormat: boolean;
  label: string;
  qFallbackTitle: string;
  id: string; // undocumented but used by the common color properties and GeoAnalytics data
}
declare interface NxAttrDimInfo {
  id: string;
  qCardinal: number;
  qSize: Size;
  qFallbackTitle: string;
  qLocked: boolean;
  qError: NxValidationError | null;
}

declare interface ExpressionProp {
  /** Expression or library id. */
  key: string;
  /** Label for the expression. */
  label?: string;
  /** How to interpret key */
  type: string;
  activeDimensionIndex?: number;
  qNumFormat?: any;
  activeMeasureIndex?: number;
}

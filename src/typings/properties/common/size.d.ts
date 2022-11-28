declare interface SizeProperties {
  /** Value from slider. Used when no expression is set. */
  value: number;
  /** Values from range slider. Used when expression is set. */
  rangeValues: number[];
  /** Expression to use for scaling symbols. */
  expression?: ExpressionProp;
  /** If false, it reveals the customMinRangeValue and customMaxRangeValue fields used to set limits to the size */
  autoRadiusValueRange: boolean;
  /** Define the min value of the symbol. */
  customMinRangeValue?: number;
  /** Define the max value of the symbol. */
  customMaxRangeValue?: number;
}

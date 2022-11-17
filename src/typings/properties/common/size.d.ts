declare interface SizeProperties {
  /** Value from slider. Used when no expression is set. */
  sliderSingle: number;
  /** Values from range slider. Used when expression is set. */
  slider: number[];
  /** Expression to use for scaling symbols. */
  expression: ExpressionProp;
  /** If true, a symbol with radiusMin is used for the smallest value in expression for the largest value and values in between are interpolated.
   * If false, radiusMin is used for all values smaller than radiusValueMin is used for all values larger than radiusValueMax. */
  autoRadiusValueRange: boolean;
  /** Define the min value of the symbol. */
  radiusValueMin?: number;
  /** Define the max value of the symbol. */
  radiusValueMax?: number;
}

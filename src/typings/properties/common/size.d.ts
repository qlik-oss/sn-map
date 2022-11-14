declare interface SizeProperties {
  /** Minimum radius of symbol in pixels. */
  radiusMin: number;
  /** Maximum radius of symbol in pixels. */
  radiusMax: number;
  /** Value from slider, translated to radiusMin and radiusMax. Used when no expression is set. */
  sliderSingle: number;
  /** Values from range slider, translated to radiusMin and radiusMax. Used when expression is set. */
  slider: number[];
  /** Expression to use for scaling symbols. */
  expression: ExpressionProp;
  /** If true, a symbol with radiusMin is used for the smallest value in expression and radiusMax for the largest value and values in between are interpolated.
   * If false, radiusMin is used for all values smaller than radiusValueMin and radiusMax is used for all values larger than radiusValueMax. */
  autoRadiusValueRange: boolean;
}

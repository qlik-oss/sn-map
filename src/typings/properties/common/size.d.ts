declare interface SizeProperties {
  /** Minimum radius of symbol in pixels. */
  radiusMin: number;
  /** Maximum radius of symbol in pixels. */
  radiusMax: number;
  /** Value from slider, translated to radiusMin and radiusMax. Used when no expression is set. */
  sliderSingle: number;
}

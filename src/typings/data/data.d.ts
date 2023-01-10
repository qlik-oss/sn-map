declare interface Data {
  geom: string | [number | string | undefined, number | string | undefined] | null;
  attributes: AttributesData;
}

/**
 * Data that will be added to the feature on the map
 * id: qElemNumber of the dimension
 * dimensionValue: qText value of the dimension
 * state: qState of the dimension
 * size: qNum value of the size attribute expression for the given dimension value
 * key: used for matching the point to the correct symbol
 */
declare interface AttributesData {
  id: number | null;
  dimensionValue: string | null;
  state: string | null;
  size?: number;
  styleKey: string;
}

declare interface LocationData {
  locationOrLatitude?: string | number;
  longitude?: string | number;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
}

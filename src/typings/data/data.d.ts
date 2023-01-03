/**
 * Data that will be added to the features on the map
 * id: qElemNumber of the dimension
 * dimensionValue: qText value of the dimension
 * state: qState of the dimension
 * geoName: private variable used for making a coordinate lookup from our location database
 * key: used for matching the point to the correct symbol
 */
declare interface Data {
  id?: number;
  dimensionValue?: string;
  state?: string;
  geoname?: string;
  key?: string;
  [key: string]: string | number;
}

declare interface LocationData {
  locationOrLatitude?: string | number;
  longitude?: string | number;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
}

declare interface DatasetInfo {
  columns: string[];
  isGeoname: boolean;
}

/**
 * Data that will be added to the point features on the map
 * size: qNum value of the size attribute expression for the given dimension value
 * coords: private variable used for positioning the point
 */
declare interface PointData extends Data {
  size?: number;
  coords?: string[] | [number | string | undefined, number | string | undefined] | null;
}

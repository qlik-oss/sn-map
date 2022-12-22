declare interface Data {
  id: number | null;
  dimValue?: string;
  locationOrLatitude?: string | undefined;
  geoname?: string;
  coords?: string[] | [number | string | undefined, number | string | undefined];
  longitude?: string;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
  key?: string;
  [key: string]: string | number;
}

declare interface DatasetInfo {
  columns: string[];
  isGeoname: boolean;
}

declare interface PointData extends Data {
  size?: number;
}

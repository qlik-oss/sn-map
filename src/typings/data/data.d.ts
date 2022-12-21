declare interface Data {
  id: number | null;
  dimValue?: string;
  locationOrLatitude: string | undefined;
  geoname?: string;
  coords?: string | number;
  longitude?: string;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
  key?: string;
}

declare interface DatasetInfo {
  columns: string[];
  isGeoname: boolean;
}

declare interface PointData extends Data {
  size?: number;
}

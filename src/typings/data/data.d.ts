declare interface Data {
  id: number | null;
  dimValue?: string;
  coords?: string | undefined | null;
  geoname?: string | undefined | null;
  location?: string | undefined | null;
  key?: string;
}

declare interface DatasetInfo {
  columns: string[];
  isGeoname: boolean;
}

declare interface LocationData {
  locationOrLatitude: string | undefined;
  longitude?: string;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
}

declare interface PointData extends Data {}

declare interface Data {
  id: number | null;
  dimValue?: string;
  locationOrLatitude: string | undefined;
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

declare interface LocationData {
  locationOrLatitude: string | undefined;
  longitude?: string;
  locationCountry?: string;
  locationAdmin1?: string;
  locationAdmin2?: string;
}

declare interface SizeData {
  expressionMeta?: ExpressionMeta;
  value?: number;
}

declare interface PointData extends Data {
  size?: SizeData;
}

declare interface LocationProperties {
  /** This can be either a latitude (if isLatLong is true), a geometry or a name of a geographic feature */
  locationOrLatitude: ExpressionProp;
  /** Internal use. Tracks if user changed locationOrLatitude. */
  locationDefault?: string; // expression that is set by default when adding dimension
  /** If true, the location is specified as latitude and longitude fields in locationOrLatitude and longitude. Otherwise the location is a geometry or name in locationOrLatitude. */
  isLatLong?: boolean;
  longitude?: ExpressionProp;
  /** If true, names in locationOrLatitude are restricted by values in locationType, locationCountry, locationAdmin1 and locationAdmin2 where not empty. */
  locationNamesAuto?: boolean;
  /** Type that restricts names in locationOrLatitude to a certain type, coded in internal coding used by the location service. */
  locationType?: string;
  /** Country that restricts names in locationOrLatitude to the country that the expression evaluates to. Country names, ISO alpha 2 or 3 codes are allowed. */
  locationCountry?: ExpressionProp;
  /** Area name or code that restricts names in locationOrLatitude to the first order administrative division that the expression evaluates to. Only used if locationCountry is specified.  */
  locationAdmin1?: ExpressionProp;
  /** Area name or code that restricts names in locationOrLatitude to the second order administrative division that the expression evaluates to. Only used if locationAdmin1 is specified.  */
  locationAdmin2?: ExpressionProp;
}

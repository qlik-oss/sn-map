declare interface Option {
  value: string;
  label: string;
}

declare interface ImageOption extends Option {
  src: string;
}

declare interface OptionsListParameters {
  rootPath: string;
}

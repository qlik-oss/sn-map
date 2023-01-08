declare module '@nebula.js/stardust';

/** Environment. (supernova parameter) */
declare type EnvironmentType = {
  translator: TranslatorType;
};

/** Translator. */
declare type TranslatorType = {
  get: Function;
  add: Function;
};

declare type RectType = {
  width: number;
  height: number;
};

declare interface Selections {
  isActive(): boolean;
  begin(path: string | string[]): void;
  cancel(): Promise<undefined>;
}

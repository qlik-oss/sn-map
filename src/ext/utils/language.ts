module LanguageUtils {
  export function getGeoTranslation(key: string, keyArea: string, translator: TranslatorType): string {
    const id = `geo.properties.${keyArea}.${key}`;
    const label = translator.get(id);
    if (label === id) {
      return key;
    }
    return label;
  }

  export function getAvailableLanguages(map: idevio.map.WebMap | undefined, translator: TranslatorType) {
    const options: Option[] = [];
    options.push({ value: 'auto', label: getGeoTranslation('auto', 'maplang', translator) });
    if (!map) {
      return options;
    }
    const n = map.getLayerCount();
    for (let i = 0; i < n; i++) {
      const l = map.getLayer(i);
      if (l.isBaseLayer()) {
        const name = l.getName();
        if (name.length > 3 && name.substring(name.length - 3) === 'Eng') {
          options.push({ value: 'english', label: getGeoTranslation('english', 'maplang', translator) });
          options.push({ value: 'local', label: getGeoTranslation('local', 'maplang', translator) });
          break;
        }
      }
    }

    return options;
  }

  export function getDefaultAvailableLanguages(translator: TranslatorType) {
    const options: Option[] = [];
    options.push({ value: 'auto', label: getGeoTranslation('auto', 'maplang', translator) });
    options.push({ value: 'english', label: getGeoTranslation('english', 'maplang', translator) });
    options.push({ value: 'local', label: getGeoTranslation('local', 'maplang', translator) });

    return options;
  }
}

export default LanguageUtils;

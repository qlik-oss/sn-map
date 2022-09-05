import LanguageUtils from '../language';
import webmapMock from '../../../mocks/webmap';

describe('Language utils', () => {
  let translator: TranslatorType;
  const correctKeyArea = 'correctKeyArea';
  const correctKey = 'correctKey';
  const translationSuccessful = 'translated';

  beforeEach(() => {
    translator = {
      get: jest.fn().mockImplementation((translation: string) => {
        return translation === `geo.properties.${correctKeyArea}.${correctKey}` ? translationSuccessful : translation;
      }),
      add: () => {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGeoTranslation', () => {
    it('should return valid translation when translation exists', () => {
      const geoTranslation = LanguageUtils.getGeoTranslation(correctKey, correctKeyArea, translator);
      expect(geoTranslation).toEqual(translationSuccessful);
    });
    it('should return the key when translation does not exists', () => {
      const wrongKeyArea = 'wrongKeyArea';
      const wrongKey = 'wrongKey';
      const geoTranslation = LanguageUtils.getGeoTranslation(wrongKey, wrongKeyArea, translator);
      expect(geoTranslation).toEqual(wrongKey);
    });
  });

  describe('getAvailableLanguages', () => {
    let map: idevio.map.WebMap;

    beforeEach(() => {
      map = new webmapMock.idevio.map.WebMap();
    });

    it('should return auto language option when map is undefined', () => {
      const languages = LanguageUtils.getAvailableLanguages(undefined, translator);
      expect(languages.length).toBe(1);
      expect(languages[0].value).toBe('auto');
      expect(translator.get).toHaveBeenCalledTimes(1);
    });

    it('should return auto, english and local language options', () => {
      const layer = {
        isBaseLayer: jest.fn().mockReturnValue(true),
        getName: jest.fn().mockReturnValue('foobar_Eng'),
      };
      map.getLayerCount = jest.fn().mockReturnValue(1);
      map.getLayer = jest.fn().mockReturnValue(layer);
      const languages = LanguageUtils.getAvailableLanguages(map, translator);
      expect(languages.length).toBe(3);
      expect(languages[0].value).toBe('auto');
      expect(languages[1].value).toBe('english');
      expect(languages[2].value).toBe('local');
      expect(translator.get).toHaveBeenCalledTimes(3);
    });

    it('should return auto language options when layer name does not have eng in the end', () => {
      const layer = {
        isBaseLayer: jest.fn().mockReturnValue(true),
        getName: jest.fn().mockReturnValue('foo_bar'),
      };
      map.getLayerCount = jest.fn().mockReturnValue(1);
      map.getLayer = jest.fn().mockReturnValue(layer);
      const languages = LanguageUtils.getAvailableLanguages(map, translator);
      expect(languages.length).toBe(1);
      expect(languages[0].value).toBe('auto');
      expect(translator.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDefaultAvailableLanguages', () => {
    it('should return default languages', () => {
      const languages = LanguageUtils.getDefaultAvailableLanguages(translator);
      expect(languages.length).toBe(3);
      expect(languages[0].value).toBe('auto');
      expect(languages[1].value).toBe('english');
      expect(languages[2].value).toBe('local');
      expect(translator.get).toHaveBeenCalledTimes(3);
    });
  });
});

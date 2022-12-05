import baseMapProperty from './base-map-property';
import { BaseMapPropertiesModel } from '../../models/base-map-properties-model';
import LanguageUtils from '../../utils/language';
import MapUtils from '../../../utils/map';
import { SelectionToolTypes } from '../../../models/selection-model/utils/const/selection-tools';

export default function mapSettings({ translator }: EnvironmentType) {
  const baseMapPropertiesModel: BaseMapPropertiesModelInterface = new BaseMapPropertiesModel(translator);

  const properties = {
    type: 'items',
    items: {
      baseMap: baseMapProperty(baseMapPropertiesModel),
      projection: {
        ref: 'mapSettings.projection',
        translation: 'geo.properties.projection',
        type: 'string',
        component: 'dropdown',
        defaultValue: 'default',
        change: (layout: MapLayout) => {
          const map = MapUtils.getMap(layout.qInfo.qId);
          MapUtils.setLanguage(layout.mapSettings.mapLanguage, map);
        },
        options: (layout: MapLayout) => {
          return baseMapPropertiesModel.getAvailableBaseMapAndProjections(layout);
        },
      },
      mapLanguage: {
        ref: 'mapSettings.mapLanguage',
        translation: 'geo.properties.maplanguage',
        type: 'string',
        component: 'dropdown',
        defaultValue: 'auto',
        change: (layout: MapLayout) => {
          const map = MapUtils.getMap(layout.qInfo.qId);
          MapUtils.setLanguage(layout.mapSettings.mapLanguage, map);
        },
        options: (layout: MapLayout) => {
          try {
            const map = MapUtils.getMap(layout.qInfo.qId);
            return LanguageUtils.getAvailableLanguages(map, translator);
          } catch {
            return LanguageUtils.getDefaultAvailableLanguages(translator);
          }
        },
      },
      useImperialUnits: {
        ref: 'mapSettings.useImperialUnits',
        translation: 'geo.properties.units',
        type: 'boolean',
        component: 'dropdown',
        defaultValue: false,
        options: [
          { value: false, translation: 'geo.properties.metric' },
          { value: true, translation: 'geo.properties.imperial' },
        ],
      },
      selectionType: {
        ref: 'mapSettings.selectionType',
        translation: 'geo.properties.selectiontype',
        type: 'string',
        component: 'dropdown',
        defaultValue: 'lasso',
        options: [
          { value: SelectionToolTypes.LASSO, translation: 'geo.properties.lassoselection' },
          { value: SelectionToolTypes.CIRCLE, translation: 'geo.properties.circleselection' },
          { value: SelectionToolTypes.NONE, translation: 'Common.None' },
        ],
      },
      zoomToSelection: {
        ref: 'mapSettings.autoZoomOnSelection',
        translation: 'geo.properties.autoZoom',
        type: 'boolean',
        defaultValue: true,
      },
    },
  };

  return {
    translation: 'geo.properties.mapsettings',
    type: 'items',
    grouped: true,
    items: {
      properties,
    },
  };
}

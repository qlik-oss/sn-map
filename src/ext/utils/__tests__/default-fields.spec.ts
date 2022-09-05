import defaultFields from '../default-fields';
import mockProperties from '../../../mocks/properties';
import { FieldsModel } from '../../../models/fields-model';

jest.mock('../../../models/fields-model');

describe('Default fields', () => {
  const FieldsModelMock = FieldsModel as jest.Mocked<typeof FieldsModel>;
  let layerProperties: LayerProperties;
  let dimension: NxDimension;

  beforeEach(() => {
    layerProperties = JSON.parse(JSON.stringify(mockProperties.layer.point));
    dimension = JSON.parse(JSON.stringify(mockProperties.layer.point.qHyperCubeDef.qDimensions[0]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setLocation', () => {
    it('should set fields from qFieldDefs when field key is missing', () => {
      layerProperties.locationOrLatitude.key = '';
      defaultFields.setLocation(dimension, layerProperties);

      expect(layerProperties.locationOrLatitude.key).toEqual('[dimension]');
      expect(layerProperties.locationOrLatitude.type).toEqual('expression');
      expect(layerProperties.locationDefault).toEqual('[dimension]');
    });

    it('should set fields from qFieldDefs when field key equals locationDefault', () => {
      layerProperties.locationOrLatitude.key = 'field';
      layerProperties.locationDefault = 'field';
      FieldsModelMock.relatedFieldName.mockImplementation();
      defaultFields.setLocation(dimension, layerProperties);

      expect(layerProperties.locationOrLatitude.key).toEqual('[dimension]');
      expect(layerProperties.locationOrLatitude.type).toEqual('expression');
      expect(layerProperties.locationDefault).toEqual('[dimension]');
    });

    it('should set related fields when field key is missing', () => {
      layerProperties.locationOrLatitude.key = '';
      FieldsModelMock.relatedFieldName.mockImplementation(() => 'relatedField');
      defaultFields.setLocation(dimension, layerProperties);

      expect(FieldsModelMock.relatedFieldName).toHaveBeenCalled();
      expect(layerProperties.locationOrLatitude.key).toEqual('[relatedField]');
      expect(layerProperties.locationOrLatitude.label).toEqual('relatedField');
      expect(layerProperties.locationOrLatitude.type).toEqual('expression');
      expect(layerProperties.locationDefault).toEqual('[relatedField]');
    });

    it('should set fields when library field', () => {
      dimension.qDef.qFieldDefs = [];
      dimension.qLibraryId = 'libraryField';
      layerProperties.locationOrLatitude.key = '';
      defaultFields.setLocation(dimension, layerProperties);

      expect(layerProperties.locationOrLatitude.key).toEqual('libraryField');
      expect(layerProperties.locationOrLatitude.type).toEqual('libraryItem');
      expect(layerProperties.locationDefault).toEqual('libraryField');
    });

    it('should set related field when field from library dimension exist', () => {
      dimension.qDef.qFieldDefs = [];
      dimension.qLibraryId = 'libraryField';
      layerProperties.locationOrLatitude.key = '';
      FieldsModelMock.fieldNameFromLibraryDimension.mockImplementation(() => 'exist');
      FieldsModelMock.relatedFieldName.mockImplementation(() => 'relatedField');
      defaultFields.setLocation(dimension, layerProperties);

      expect(layerProperties.locationOrLatitude.key).toEqual('[relatedField]');
      expect(layerProperties.locationOrLatitude.type).toEqual('expression');
      expect(layerProperties.locationDefault).toEqual('[relatedField]');
    });

    it('should not set fields from qFieldDefs when field key does not equal locationDefault', () => {
      layerProperties.locationOrLatitude.key = 'foobar';
      layerProperties.locationDefault = 'field';
      defaultFields.setLocation(dimension, layerProperties);

      expect(layerProperties.locationOrLatitude.key).toEqual('foobar');
      expect(layerProperties.locationDefault).toEqual('field');
    });
  });

  describe('setColor', () => {
    it('should not set the default color of the new layer when color is set to auto', () => {
      layerProperties.color.auto = true;
      const newLayer = JSON.parse(JSON.stringify(layerProperties));
      defaultFields.setColor(layerProperties, [newLayer]);
      expect(layerProperties.color.mode).toBeUndefined();
      expect(layerProperties.color.paletteColor).toBeUndefined();
    });

    it('should set the default color of the new layer when color of previous layers does exist', () => {
      const newLayer = JSON.parse(JSON.stringify(layerProperties));
      newLayer.color = { auto: false, paletteColor: { index: 6 }, mode: 'primary' };
      defaultFields.setColor(layerProperties, [newLayer, newLayer]);
      expect(layerProperties.color.auto).toEqual(false);
      expect(layerProperties.color.mode).toEqual('primary');
      expect(layerProperties.color.paletteColor).toMatchObject({ index: 9, color: '#f8981d' });
    });

    it('should set the default color of the new layer when color of previous layers does not exist', () => {
      const newLayer = JSON.parse(JSON.stringify(layerProperties));
      newLayer.color = { auto: false, paletteColor: { index: 10 }, mode: 'primary' };
      defaultFields.setColor(layerProperties, [newLayer, newLayer]);
      expect(layerProperties.color.auto).toEqual(false);
      expect(layerProperties.color.mode).toEqual('primary');
      expect(layerProperties.color.paletteColor).toMatchObject({ index: 6, color: '#4477aa' });
    });
  });
});

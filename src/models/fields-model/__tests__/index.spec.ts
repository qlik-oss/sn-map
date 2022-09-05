import { FieldsModel } from '../';

describe('Fields model', () => {
  let fields: Field[];
  let dimensions: LibraryDimension[];

  beforeEach(() => {
    fields = [
      {
        qName: 'foobar',
        qTags: ['tag'],
        qSrcTables: ['table'],
      },
    ];
    dimensions = [
      {
        qInfo: { qId: 'libraryId' },
        qData: { info: [{ qName: 'field' }] },
      },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('load', () => {
    it('should call getLayout for fields and dimensions', async () => {
      const getFieldLayout = jest.fn().mockResolvedValue('foo');
      const getDimensionLayout = jest.fn().mockResolvedValue('bar');
      const app = {
        getOnTheFlyWithHiddenListObject: jest.fn().mockResolvedValue({
          getLayout: getFieldLayout,
        }),
        getDimensionListObject: jest.fn().mockResolvedValue({
          getLayout: getDimensionLayout,
        }),
      };
      await FieldsModel.load(app);
      expect(getFieldLayout).toHaveBeenCalled();
      expect(getDimensionLayout).toHaveBeenCalled();
    });
  });

  describe('fieldNameFromLibraryDimension', () => {
    it('should return first field', () => {
      FieldsModel.loadTest([], dimensions);
      const result = FieldsModel.fieldNameFromLibraryDimension('libraryId');
      expect(result).toEqual('field');
    });

    it('should return null when field id and libraryId do not match', () => {
      FieldsModel.loadTest([], dimensions);
      const result = FieldsModel.fieldNameFromLibraryDimension('foobar');
      expect(result).toBeNull();
    });
  });

  describe('getFirstFieldName', () => {
    it('should return first field name', () => {
      const result = FieldsModel.getFirstFieldName(dimensions[0]);
      expect(result).toEqual('field');
    });
  });

  describe('relatedFieldName', () => {
    it('should return null when findField returns null', () => {
      const spy = jest.spyOn(FieldsModel, 'findField');
      spy.mockReturnValue(null);

      const result = FieldsModel.relatedFieldName('', '');
      expect(result).toBeNull();
      spy.mockRestore();
    });

    it('should return related field when findField returns field', () => {
      const findFieldSpy = jest.spyOn(FieldsModel, 'findField');
      fields[0].qName = 'field';
      findFieldSpy.mockReturnValue(fields[0]);

      const relatedFieldSpy = jest.spyOn(FieldsModel, 'relatedField');
      relatedFieldSpy.mockReturnValue('relatedField');

      const result = FieldsModel.relatedFieldName('', '');
      expect(relatedFieldSpy).toHaveBeenCalled();
      expect(result).toBe('relatedField');
      findFieldSpy.mockRestore();
      relatedFieldSpy.mockRestore();
    });
  });

  describe('findField', () => {
    it('should return null when there are no fields', () => {
      FieldsModel.loadTest([], []);

      const result = FieldsModel.findField('field');
      expect(result).toBeNull();
    });

    it('should return null when it can not find field', () => {
      FieldsModel.loadTest(fields, []);

      const result = FieldsModel.findField('field');
      expect(result).toBeNull();
    });

    it('should return field', () => {
      fields[0].qName = 'field';
      FieldsModel.loadTest(fields, []);

      const result = FieldsModel.findField('field');
      expect(result).toEqual(fields[0]);
    });
  });

  describe('relatedField', () => {
    it('should return null when getRelatedFields returns []', () => {
      const getRelatedFieldsSpy = jest.spyOn(FieldsModel, 'getRelatedFields');
      getRelatedFieldsSpy.mockReturnValue([]);

      const result = FieldsModel.relatedField(fields[0], 'PointLayer');
      expect(result).toBeNull();
      getRelatedFieldsSpy.mockRestore();
    });

    it('should return null when invalid type', () => {
      const getRelatedFieldsSpy = jest.spyOn(FieldsModel, 'getRelatedFields');
      getRelatedFieldsSpy.mockReturnValue(fields);

      const isNormalGeoPointFieldSpy = jest.spyOn(FieldsModel, 'isNormalGeoPointField');
      isNormalGeoPointFieldSpy.mockReturnValue(true);

      const result = FieldsModel.relatedField(fields[0], 'foobar');
      expect(result).toBeNull();
      getRelatedFieldsSpy.mockRestore();
      isNormalGeoPointFieldSpy.mockRestore();
    });

    it('should return null when not a normal geo point field', () => {
      const getRelatedFieldsSpy = jest.spyOn(FieldsModel, 'getRelatedFields');
      getRelatedFieldsSpy.mockReturnValue(fields);

      const isNormalGeoPointFieldSpy = jest.spyOn(FieldsModel, 'isNormalGeoPointField');
      isNormalGeoPointFieldSpy.mockReturnValue(false);

      const result = FieldsModel.relatedField(fields[0], 'PointLayer');
      expect(isNormalGeoPointFieldSpy).toHaveBeenCalled();
      expect(result).toBeNull();
      getRelatedFieldsSpy.mockRestore();
      isNormalGeoPointFieldSpy.mockRestore();
    });

    it('should return related field qName', () => {
      const getRelatedFieldsSpy = jest.spyOn(FieldsModel, 'getRelatedFields');
      getRelatedFieldsSpy.mockReturnValue(fields);

      const isNormalGeoPointFieldSpy = jest.spyOn(FieldsModel, 'isNormalGeoPointField');
      isNormalGeoPointFieldSpy.mockReturnValue(true);

      const result = FieldsModel.relatedField(fields[0], 'PointLayer');
      expect(isNormalGeoPointFieldSpy).toHaveBeenCalled();
      expect(result).toBe(fields[0].qName);
      getRelatedFieldsSpy.mockRestore();
      isNormalGeoPointFieldSpy.mockRestore();
    });
  });

  describe('getRelatedFields', () => {
    it('should return array with related fields that matches fields', () => {
      const relatedField = {
        qName: 'relatedField',
        qTags: ['tag'],
        qSrcTables: ['table'],
      };
      fields.push(relatedField);
      const spy = jest.spyOn(FieldsModel, 'getRelatedFieldNames');
      spy.mockReturnValue(['relatedField', 'foobar', 'field']);

      const result = FieldsModel.getRelatedFields(fields[0], fields);
      expect(result.length).toBe(2);
      expect(result).toEqual([fields[0], relatedField]);
      spy.mockRestore();
    });
  });

  describe('getRelatedFieldNames', () => {
    it('should return related field names', () => {
      fields[0].qTags = ['tag', '$relates_field1', '$relates_field2'];
      const result = FieldsModel.getRelatedFieldNames(fields[0]);
      expect(result).toEqual(['field1', 'field2']);
    });

    it('should return empty array when no qTags', () => {
      fields[0].qTags = [];
      const result = FieldsModel.getRelatedFieldNames(fields[0]);
      expect(result).toEqual([]);
    });
  });

  describe('isNormalGeoPointField', () => {
    it('should be false when no geopoint or geotag', () => {
      fields[0].qTags = ['tag'];
      const result = FieldsModel.isNormalGeoPointField(fields[0]);
      expect(result).toBe(false);
    });

    it('should be true when having a geopoint tag', () => {
      fields[0].qTags = ['tag', '$geopoint'];
      const result = FieldsModel.isNormalGeoPointField(fields[0]);
      expect(result).toBe(true);
    });

    it('should be true when having a geotag', () => {
      fields[0].qTags = ['tag', '$geotag'];
      const result = FieldsModel.isNormalGeoPointField(fields[0]);
      expect(result).toBe(true);
    });

    it('should be true when having a geopoint and geotag', () => {
      fields[0].qTags = ['tag', '$geotag', '$geotag'];
      const result = FieldsModel.isNormalGeoPointField(fields[0]);
      expect(result).toBe(true);
    });
  });
});

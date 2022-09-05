import { DataModel } from '../index';
import LocationUtils from '../utils/location-utils';
import DataUtils from '../utils/data-utils';

describe('Common DataModel', () => {
  let dataModel: DataModel;
  let data: Data[];
  let cell: NxCell;

  beforeEach(() => {
    dataModel = new DataModel();
    data = [
      {
        id: 0,
      },
    ];
    cell = {
      qElemNumber: 0,
      qState: 'S',
    };
  });

  it('should set data', () => {
    dataModel.setData(data);
    expect(dataModel.data).toEqual(data);
  });

  it('should get data', () => {
    dataModel.setData(data);
    const result = dataModel.getData();
    expect(result).toEqual(data);
  });

  it('should getElemData', () => {
    cell.qText = 'text';
    const result = dataModel.getElemData(cell);
    expect(result.id).toBe(cell.qElemNumber);
  });

  describe('getLocationData', () => {
    let meta: LocationMeta;

    beforeEach(() => {
      meta = {
        expressions: [
          {
            id: 'foobar',
            index: 0,
            dimIndex: 0,
            isDimension: false,
          },
        ],
        isAuto: false,
        isLatLong: false,
        locationType: '',
      };

      cell = {
        qElemNumber: 0,
        qState: 'S',
        qText: 'foobar',
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should add latitude and longitude coords', () => {
      DataUtils.getAttributeData = jest.fn().mockReturnValue({
        locationOrLatitude: '1,1',
        longitude: '2,2',
      });
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('LATLONGS');
      const result = dataModel.getLocationData(cell, meta);
      expect(DataUtils.getAttributeData).toHaveBeenCalled();
      expect(LocationUtils.getLocationKind).toHaveBeenCalled();
      expect((result.coords as number[]).length).toBe(2);
      expect((result.coords as number[])[0]).toBe(1.1);
      expect((result.coords as number[])[1]).toBe(2.2);
    });

    it('should add string coords and use qText when undefined expression', () => {
      DataUtils.getAttributeData = jest.fn().mockReturnValue({
        locationOrLatitude: undefined,
      });
      cell.qText = '[1,2]';
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('STRINGCOORDS');
      LocationUtils.parseGeometryString = jest.fn().mockReturnValue('[1,2]');

      const result = dataModel.getLocationData(cell, meta);
      expect(DataUtils.getAttributeData).toHaveBeenCalled();
      expect(LocationUtils.getLocationKind).toHaveBeenCalled();
      expect(LocationUtils.parseGeometryString).toHaveBeenCalledWith('[1,2]');
      expect(result.coords).toBe('[1,2]');
    });

    it('should add geoname', () => {
      DataUtils.getAttributeData = jest.fn().mockReturnValue({
        locationOrLatitude: 'foobar',
      });
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('NAMES');
      LocationUtils.addLocationSuffix = jest.fn().mockReturnValue('geoname');

      const result = dataModel.getLocationData(cell, meta);
      expect(DataUtils.getAttributeData).toHaveBeenCalled();
      expect(LocationUtils.getLocationKind).toHaveBeenCalled();
      expect(LocationUtils.addLocationSuffix).toHaveBeenCalled();
      expect(result?.geoname).toBe('geoname');
    });

    it('should return null when UNKOWN location', () => {
      DataUtils.getAttributeData = jest.fn().mockReturnValue({
        locationOrLatitude: 'foobar',
      });
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('UNKOWN');
      const result = dataModel.getLocationData(cell, meta);
      expect(DataUtils.getAttributeData).toHaveBeenCalled();
      expect(result.location).toBe(null);
    });
  });
});

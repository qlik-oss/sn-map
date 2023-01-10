import DataUtils from '../utils';
import LocationUtils from '../../location/utils';
import { updateSizeExpression } from '../../size/definition';
import mockProperties from '../../../../../mocks/properties';

jest.mock('../../location/utils');
jest.mock('../../size/definition');

describe('data utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should update location expressions', () => {
    DataUtils.updateAttributeExpressions(mockProperties.layer.area);
    expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    expect(updateSizeExpression).not.toHaveBeenCalled();
  });
  it('should update size and location expressions when PointLayer', () => {
    DataUtils.updateAttributeExpressions(mockProperties.layer.point);
    expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    expect(updateSizeExpression).toHaveBeenCalled();
  });
});

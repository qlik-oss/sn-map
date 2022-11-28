import DataUtils from '../utils';
import LocationUtils from '../../location/utils';
import * as sizeDefinition from '../../size/definition';
import mockProperties from '../../../../../mocks/properties';

jest.mock('../../location/utils');

describe('data utils', () => {
  let updateSizeExpressionSpy: any;
  beforeEach(() => {
    updateSizeExpressionSpy = jest.spyOn(sizeDefinition, 'updateSizeExpression').mockImplementation(() => {});
  });
  it('should update attribute expressions', () => {
    DataUtils.updateAttributeExpressions(mockProperties.layer.point);
    expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    expect(updateSizeExpressionSpy).toHaveBeenCalled();
  });
});

import DataUtils from '../utils';
import LocationUtils from '../../location/utils';
import * as attrExprUtils from '../../../../utils/attribute-expression-utils';
import mockProperties from '../../../../../mocks/properties';

jest.mock('../../location/utils');
jest.mock('../../../../utils/attribute-expression-utils');

describe('data utils', () => {
  it('should update attribute expressions', () => {
    DataUtils.updateAttributeExpressions(mockProperties.layer.point);
    expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    expect(attrExprUtils.setAttributeExpression).toHaveBeenCalled();
  });
});

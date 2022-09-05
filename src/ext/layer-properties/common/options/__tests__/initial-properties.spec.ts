import LayerType from '../../../../../utils/const/layer-type';
import getOptionsProperties from '../initial-properties';

describe('options initial-properties', () => {
  it('should return appearance items for GeodataLayer type', () => {
    const initialValues = getOptionsProperties(LayerType.GEODATA);
    expect(initialValues).toHaveProperty('appearance');
  });
});

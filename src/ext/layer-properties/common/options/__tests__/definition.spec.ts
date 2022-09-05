import LayerType from '../../../../../utils/const/layer-type';
import getOptionsDefinition from '../definition';

describe('options definition', () => {
  it('should have appearance for GeodataLayer', () => {
    const definition = getOptionsDefinition(LayerType.GEODATA);
    expect(definition.items).toHaveProperty('appearance');
  });
});

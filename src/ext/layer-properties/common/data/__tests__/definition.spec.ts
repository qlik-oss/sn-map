import getDataDefinition from '../definition';
import env from '../../../../../mocks/environment';
import DefaultFields from '../../../../utils/default-fields';
import DataUtils from '../utils';

jest.mock('../../../../utils/default-fields');
jest.mock('../utils');

describe('data definition', () => {
  let props: any;
  let dimension: any;
  let layerProps: any;
  let definition: any;

  beforeEach(() => {
    props = {
      qHyperCubeDef: {
        qDimensions: [{ id: 'dimension1' }],
      },
      type: 'PointLayer',
    };
    dimension = { qDef: { qSortCriterias: [{ qSortByLoadOrder: 0, qSortByAscii: 0, qSortByNumeric: 0 }] } };
    layerProps = {
      locationDefault: 'layer_key1',
      locationOrLatitude: {
        key: 'layer_key1',
        type: 'layer_type',
        label: 'layer_label',
      },
    };
    definition = getDataDefinition(1, 0, env);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return data definition', () => {
    expect(definition.items.helpText.component).toEqual('text');
    expect(definition.items.data.uses).toEqual('data');
  });

  it('should should hide and show the helpText', () => {
    let isShown = definition.items.helpText.show(props);
    expect(isShown).toEqual(false);
    isShown = definition.items.helpText.show({
      qHyperCubeDef: {
        qDimensions: [],
      },
      type: '',
    });
    expect(isShown).toEqual(true);
  });

  it('should check dimension description', () => {
    let description = definition.items.data.dimension.description(props);
    expect(description).toEqual('Visualizations.Descriptions.Point');
    description = definition.items.data.dimension.description({ type: '' });
    expect(description).toEqual('');
  });
  it('should check when a dimension is added', () => {
    definition.items.data.dimension.add(dimension);
    expect(dimension.qDef.qSortCriterias[0]['qSortByLoadOrder']).toEqual(1);
    expect(dimension.qDef.qSortCriterias[0]['qSortByAscii']).toEqual(1);
    expect(dimension.qDef.qSortCriterias[0]['qSortByNumeric']).toEqual(1);
    expect(DefaultFields.setLocation).toHaveBeenCalled();
    expect(DataUtils.updateAttributeExpressions).toHaveBeenCalled();
  });
  it('should check when a dimension is removed', () => {
    definition.items.data.dimension.remove(dimension, layerProps);
    expect(layerProps.locationOrLatitude.key).toEqual('');
    expect(layerProps.locationOrLatitude.label).toEqual('');
    expect(layerProps.locationOrLatitude.type).toEqual('');
  });
});

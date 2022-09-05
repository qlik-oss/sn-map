import getDefinition from '../definition';
import env from '../../../../../mocks/environment';

describe('size definition', () => {
  let props: any;

  beforeEach(() => {
    props = {
      size: {
        shape: 'points',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid size definition for PointLayer type', () => {
    const definition = getDefinition('PointLayer', env);
    expect(definition.items).toHaveProperty('sizeSingleSlider');
    expect(definition.items.sizeSingleSlider.component).toEqual('slider');
    definition.items.sizeSingleSlider.label(props);
    expect(env.translator.get).toHaveBeenCalledTimes(1);
  });

  it('should change the radiusMin and radiusMax properly when sliderSingle is <20', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.sliderSingle = 19;
    definition.items.sizeSingleSlider.change(props);
    expect(props.size.radiusMin).toEqual(5);
    expect(props.size.radiusMax).toEqual(15);
  });

  it('should change the radiusMin and radiusMax properly when sliderSingle is <40', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.sliderSingle = 21;
    definition.items.sizeSingleSlider.change(props);
    expect(props.size.radiusMin).toEqual(5);
    expect(props.size.radiusMax).toEqual(17);
  });

  it('should change the radiusMin and radiusMax properly when sliderSingle is <60', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.sliderSingle = 41;
    definition.items.sizeSingleSlider.change(props);
    expect(props.size.radiusMin).toEqual(16);
    expect(props.size.radiusMax).toEqual(48);
  });

  it('should change the radiusMin and radiusMax properly when sliderSingle is >=60', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.sliderSingle = 61;
    definition.items.sizeSingleSlider.change(props);
    expect(props.size.radiusMin).toEqual(37);
    expect(props.size.radiusMax).toEqual(111);
  });
});

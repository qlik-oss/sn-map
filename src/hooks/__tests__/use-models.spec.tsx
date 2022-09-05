/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import webmapMock from '../../mocks/webmap';
import mockLayout from '../../mocks/layout';
import * as mapModelModule from '../../models/map-model';
import useModels from '../use-models';

Enzyme.configure({ adapter: new Adapter() });

describe('use-models', () => {
  global.idevio = webmapMock.idevio;
  const webmapElement = document.createElement('div');
  const webMapRef: any = { offsetHeight: 100, current: webmapElement };
  let core: any;
  let Component: any;
  let mapModel: any;

  beforeEach(() => {
    mapModel = {
      update: jest.fn(),
    };
    jest.spyOn(mapModelModule, 'MapModel').mockReturnValue(mapModel);
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    jest.spyOn(nebula, 'useState').mockImplementation(React.useState);
    jest.spyOn(nebula, 'useApp').mockReturnValue({});
    jest.spyOn(nebula, 'useStaleLayout').mockReturnValue(mockLayout.map);
    jest.spyOn(nebula, 'useRect').mockReturnValue({});
    core = {
      element: document.createElement('div'),
      webmap: webmapMock,
    };
    Component = () => {
      useModels({ core, webMapRef });
      return <div />;
    };
    mount(<Component />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the useEffects', () => {
    expect(nebula.useApp).toHaveBeenCalled();
    expect(nebula.useStaleLayout).toHaveBeenCalled();
    expect(nebula.useRect).toHaveBeenCalled();
    expect(mapModel.update).toHaveBeenCalled();
  });
});

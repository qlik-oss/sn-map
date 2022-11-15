/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import webmapMock from '../../mocks/webmap';
import mockLayout from '../../mocks/layout';
import * as mapModelModule from '../../models/map-model';
import useModels from '../use-models';

describe('use-models', () => {
  global.idevio = webmapMock.idevio;
  const webmapElement = document.createElement('div');
  const webMapRef: any = { offsetHeight: 100, current: webmapElement };
  const dummyReturn: any = {};
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
    jest.spyOn(nebula, 'useApp').mockReturnValue(dummyReturn);
    jest.spyOn(nebula, 'useStaleLayout').mockReturnValue(mockLayout.map);
    jest.spyOn(nebula, 'useRect').mockReturnValue(dummyReturn);
    core = {
      element: document.createElement('div'),
      webmap: webmapMock,
    };
    Component = () => {
      useModels({ core, webMapRef });
      return <div />;
    };
    render(<Component />);
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

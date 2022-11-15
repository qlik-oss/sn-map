/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import * as useViewState from '../use-view-state';
import webmapMock from '../../mocks/webmap';

import useCore from '../use-core';

jest.mock('../use-webmap', () => jest.fn());

describe('use-core', () => {
  global.idevio = webmapMock.idevio;
  const dummyReturn: any = {};
  let core: { webmap: idevio.map.WebMap; element: HTMLElement };
  let setCore: any;
  const Component = () => {
    useCore();
    return <div />;
  };

  beforeEach(() => {
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    jest.spyOn(nebula, 'useElement').mockReturnValue(dummyReturn);
    jest.spyOn(nebula, 'useOptions').mockReturnValue(dummyReturn);
    jest.spyOn(nebula, 'useStaleLayout').mockReturnValue(dummyReturn);
    jest.spyOn(useViewState, 'default').mockReturnValue('some-view-state');
    setCore = jest.fn();
    jest.spyOn(nebula, 'useState').mockReturnValue([core, setCore]);
    render(<Component />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the useEffect', () => {
    expect(setCore).toHaveBeenCalled();
  });
});

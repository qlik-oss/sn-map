/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as useViewState from '../use-view-state';
import webmapMock from '../../mocks/webmap';

import useCore from '../use-core';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../use-webmap', () => jest.fn());

describe('use-core', () => {
  global.idevio = webmapMock.idevio;
  let core: { webmap: idevio.map.WebMap; element: HTMLElement };
  let setCore: Function;
  const Component = () => {
    useCore();
    return <div />;
  };

  beforeEach(() => {
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    jest.spyOn(nebula, 'useElement').mockReturnValue({});
    jest.spyOn(nebula, 'useOptions').mockReturnValue({});
    jest.spyOn(useViewState, 'default').mockReturnValue('some-view-state');
    setCore = jest.fn();
    jest.spyOn(nebula, 'useState').mockReturnValue([core, setCore]);
    mount(<Component />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the useEffect', () => {
    expect(setCore).toHaveBeenCalled();
  });
});

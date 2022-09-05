/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import useWebmap from '../use-webmap';

Enzyme.configure({ adapter: new Adapter() });

describe('use-webmap', () => {
  let state: any;
  let setState: any;
  const options = {
    configuration: {
      serverUrl: 'host',
    },
  };
  const win = window as any;
  const Component = () => {
    useWebmap(options);
    return <div />;
  };

  beforeEach(() => {
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    state = {};
    setState = jest.fn();
    jest.spyOn(nebula, 'useState').mockReturnValue([state, setState]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the useEffect', () => {
    mount(<Component />);
    expect(win.onIdevioWebMapError).toBeDefined();
  });

  it('should set connection status to Loading from Failed', () => {
    win.idevio.Connection.status = 'FAILED';
    mount(<Component />);
    expect(win.onIdevioWebMapError).toBeDefined();
    expect(win.idevio.Connection.status).toEqual('LOADING');
  });

  it('should update the state when the map is loaded', () => {
    win.idevio.Connection.status = 'OK';
    mount(<Component />);
    expect(setState).toHaveBeenCalled();
  });
});

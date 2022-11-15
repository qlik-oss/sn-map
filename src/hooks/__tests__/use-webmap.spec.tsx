/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';

import useWebmap from '../use-webmap';

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
    render(<Component />);
    expect(win.onIdevioWebMapError).toBeDefined();
  });

  it('should set connection status to Loading from Failed', () => {
    win.idevio.Connection.status = 'FAILED';
    render(<Component />);
    expect(win.onIdevioWebMapError).toBeDefined();
    expect(win.idevio.Connection.status).toEqual('LOADING');
  });

  it('should update the state when the map is loaded', () => {
    win.idevio.Connection.status = 'OK';
    render(<Component />);
    expect(setState).toHaveBeenCalled();
  });
});

/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import useViewState from '../use-view-state';

describe('use-view-state', () => {
  const Component = () => {
    useViewState();
    return <div />;
  };
  let setViewState: any;

  beforeEach(() => {
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    setViewState = jest.fn();
    jest.spyOn(nebula, 'useState').mockReturnValue(['', setViewState]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger useEffect', () => {
    render(<Component />);
    expect(setViewState).toHaveBeenCalled();
  });
});

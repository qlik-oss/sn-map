/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import useViewState from '../use-view-state';

Enzyme.configure({ adapter: new Adapter() });

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
    mount(<Component />);
    expect(setViewState).toHaveBeenCalled();
  });
});

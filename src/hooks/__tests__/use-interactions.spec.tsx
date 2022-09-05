/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import useInteractions from '../use-interactions';

import mapModelMock from '../../mocks/map-model';
import webmapMock from '../../mocks/webmap';

jest.mock('../../models/selection-model');

Enzyme.configure({ adapter: new Adapter() });

describe('use-interactions', () => {
  let select: Function;
  const Component = () => {
    mapModelMock.map = new webmapMock.idevio.map.WebMap();
    useInteractions(mapModelMock);
    return <div />;
  };

  beforeEach(() => {
    select = jest.fn();
    jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
    jest.spyOn(nebula, 'useState').mockImplementation(React.useState);
    jest.spyOn(nebula, 'useSelections').mockReturnValue({
      isActive: () => true,
      select,
    });
    jest.spyOn(nebula, 'useConstraints').mockReturnValue({
      select: true,
      active: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useEffect selections isActive', () => {
    it('should trigger select when selections isActive returns true', () => {
      mount(<Component />);
      expect(nebula.useSelections).toHaveBeenCalled();
      expect(mapModelMock.map.addListener).toHaveBeenCalled();
      expect(select).toHaveBeenCalled();
    });

    it('should not trigger select when selections isActive returns false', () => {
      jest.spyOn(nebula, 'useSelections').mockReturnValue({
        isActive: () => false,
        select,
      });
      mount(<Component />);
      expect(nebula.useSelections).toHaveBeenCalled();
      expect(mapModelMock.map.addListener).toHaveBeenCalled();
      expect(select).not.toHaveBeenCalled();
    });
  });

  describe('useEffect constraints', () => {
    it('should call useConstraints', () => {
      mount(<Component />);
      expect(nebula.useConstraints).toHaveBeenCalled();
    });
  });
});

/**
 * @jest-environment jsdom
 */

import * as nebula from '@nebula.js/stardust';
import React from 'react';
import { render } from '@testing-library/react';
import useRender from '../use-render';

describe('use-render', () => {
  jest.spyOn(nebula, 'useEffect').mockImplementation(React.useEffect);
  const webmapElement = document.createElement('div');
  const core: any = { element: webmapElement };
  const setWebMapRef: any = () => {};
  const Component = () => {
    useRender({ core, setWebMapRef });
    return <div />;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger useEffect', () => {
    render(<Component />);
    expect(webmapElement.querySelector('.map-root')).toBeDefined();
  });
});

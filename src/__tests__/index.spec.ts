import * as nebula from '@nebula.js/stardust';
import { useState } from '@nebula.js/stardust';

import env from '../mocks/environment';
import supernova from '..';
import qae from '../qae';
import ext from '../ext/ext';
import locale from '../locale';
import { useRender, useCore, useModels, useInteractions } from '../hooks';

jest.mock('../qae', () => jest.fn());
jest.mock('../ext/ext', () => jest.fn());
jest.mock('../locale', () => jest.fn());
jest.mock('../hooks', () => ({
  useCore: jest.fn(),
  useModels: jest.fn(),
  useInteractions: jest.fn(),
  useRender: jest.fn(),
}));

describe('map supernova', () => {
  beforeEach(() => {
    jest.mock('@nebula.js/stardust', () => jest.fn());
    nebula.useState = jest.fn().mockReturnValue([{}, jest.fn()]);
    const map = supernova(env);
    map.component();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call qae', () => {
    expect(qae).toHaveBeenCalledTimes(1);
  });

  it('should call ext', () => {
    expect(ext).toHaveBeenCalledTimes(1);
  });

  it('should call locale', () => {
    expect(locale).toHaveBeenCalledTimes(1);
  });

  it('should call all hooks', () => {
    expect(useState).toHaveBeenCalledTimes(1);
    expect(useCore).toHaveBeenCalledTimes(1);
    expect(useModels).toHaveBeenCalledTimes(1);
    expect(useInteractions).toHaveBeenCalledTimes(1);
    expect(useRender).toHaveBeenCalledTimes(1);
  });
});

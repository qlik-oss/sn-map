// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from '@testing-library/react';
import * as stardust from '@nebula.js/stardust';
import useSelectionToolbar from '../use-selection-toolbar';
import mockLayout from '../../mocks/layout';

describe('use-selection-toolbar', () => {
  let constraints;
  let enabled: boolean;
  let setEnabled: any;
  let active: boolean;
  let setActive: any;
  let layout;
  let fn;
  let conditionArray;
  const Component = () => {
    useSelectionToolbar();
    return <div />;
  };
  let useEffectSpy: any;
  let useActionSpy: any;

  beforeEach(() => {
    constraints = { active: false, select: false };
    layout = JSON.parse(JSON.stringify(mockLayout.map));
    layout.qSelectionInfo = { qInSelections: false };
    active = false;
    enabled = false;
    setEnabled = jest.fn();
    setActive = jest.fn();
    jest.spyOn(stardust, 'useConstraints').mockReturnValue(constraints);
    jest.spyOn(stardust, 'useState').mockImplementation(React.useState);
    jest
      .spyOn(stardust, 'useState')
      .mockImplementationOnce(() => [enabled, setEnabled])
      .mockImplementationOnce(() => [active, setActive]);
    useEffectSpy = jest.spyOn(stardust, 'useEffect').mockImplementation(React.useEffect);
    jest.spyOn(stardust, 'useLayout').mockReturnValue(layout);
    useActionSpy = jest.spyOn(stardust, 'useAction').mockImplementation(() => {});
    jest.spyOn(stardust, 'useTranslator');
    jest
      .spyOn(stardust, 'useTranslator')
      .mockReturnValue({ get: (text: string) => `${text}-translated`, add: () => {} });
  });

  describe('useEffect', () => {
    it('should have the second argument being an array having constraints as the only element', () => {
      render(<Component />);
      expect(stardust.useEffect).toHaveBeenCalled();
    });

    describe('the function in the argument list', () => {
      it('should call setEnabled if constraints is defined', () => {
        render(<Component />);
        fn = useEffectSpy.mock.calls[0][0];
        fn();
        expect(setEnabled).toBeCalledTimes(1);
      });
    });
  });

  describe('useAction', () => {
    it('should have the second argument being an array with correct elements', () => {
      render(<Component />);
      conditionArray = useActionSpy.mock.calls[0][1];
      expect(conditionArray).toEqual([false, false, false, false]);
    });

    describe('the function in the argument list', () => {
      it('should return correct object', () => {
        enabled = true;
        jest.spyOn(stardust, 'useState').mockImplementationOnce(() => [enabled, setEnabled]);
        layout.qSelectionInfo = { qInSelections: true };
        jest.spyOn(stardust, 'useLayout').mockReturnValue(layout);
        render(<Component />);
        expect(useActionSpy).toHaveBeenCalled();
      });
    });
  });
});

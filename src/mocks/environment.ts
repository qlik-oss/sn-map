const translator: TranslatorType = {
  get: jest.fn().mockImplementation((translation: string) => translation),
  add: jest.fn(),
};
const env: EnvironmentType = { translator };
export default env;

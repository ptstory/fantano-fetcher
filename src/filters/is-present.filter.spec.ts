import { isPresent } from './is-present.filter';

describe('isPresent filter', () => {
  [{}, [], ['a'], 'string', 1, true].forEach((testValue) => {
    test(`should pass for ${testValue}`, () => {
      expect(isPresent(testValue)).toBe(true);
    });
  });

  [null, undefined, '', false, NaN, 0].forEach((testValue) => {
    test(`should fail for ${testValue}`, () => {
      expect(isPresent(testValue)).toBe(false);
    });
  });
});

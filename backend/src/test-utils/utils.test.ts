// __tests__/utils.test.ts
import { add } from './utils';

// describe('add function', () => {
//   it('should add two numbers correctly', () => {
//     const result = add(2, 3);
//     expect(result).toBe(5);
//   });

//   it('should return a negative number when adding a positive and negative number', () => {
//     const result = add(2, -3);
//     expect(result).toBe(-1);
//   });

//   it('should return 0 when adding two zeros', () => {
//     const result = add(0, 0);
//     expect(result).toBe(0);
//   });
// });

// test('two plus two is four', () => {
//   expect(2 + 2).toBe(4);
// });


test('zero', () => {
  const z = 0;
  // expect(z).not.toBeNull();
  // expect(z).toBeDefined();
  // expect(z).not.toBeUndefined();
  // expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
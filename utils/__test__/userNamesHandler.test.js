// set test suite
const calc = (a, b) => a + b;

describe('Test example', () => {
  // set single test
  test('test calc sum 2 + 2', () => {
    expect(calc(2, 2)).toBe(4);
  });

  // set single test
  it('should return 5', () => {
    expect(calc(2, 3)).toBe(5);
  });
});
// const userNameHandler = require('../userNamesHandler');

// const testingData = [
//   { input: 'Jimi Hendrix', output: 'Jimi Hendrix' },
//   { input: 'jimi hendrix', output: 'Jimi Hendrix' },
//   { input: 'jimi Hendrix', output: 'Jimi Hendrix' },
//   { input: '   Jimi  hendriX ', output: 'Jimi Hendrix' },
//   { input: 'Jimi_Hendrix', output: 'Jimi Hendrix' },
//   { input: 'jimi.hendrix', output: 'Jimi Hendrix' },
//   { input: 'jimi@hend@rix', output: 'Jimi Hend Rix' },
//   { input: '_jimi * hendrix', output: 'Jimi Hendrix' },
//   { input: 'jimi hèndrix__', output: 'Jimi Hendrix' },
//   { input: 'jimi中村hèndrix__', output: 'Jimi Hendrix' },
//   { input: 'jimi de Hèndrix__', output: 'Jimi De Hendrix' },
//   { input: '中村哲二', output: '' },
//   { input: undefined, output: '' },
//   { input: null, output: '' },
//   { input: true, output: '' },
// ];

// describe('User names handler tests', () => {
//   it('should returns Jimi Hendrix', () => {
//     expect(userNameHandler(testingData[0].input)).toBe(testingData[0].output);
//   });

//   test('test all user name cases', () => {
//     for (const item of testingData) {
//       const normalizedName = userNameHandler(item.input);

//       expect(normalizedName).toBe(item.output);
//     }
//   });
// });

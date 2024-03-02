const functions = require('../userData');

test('determinePayPeriod properly determines the correct pay period', () => {
  dateSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('03-01-2024'));
  expect(functions.determinePayPeriod()).toBe(1);
  dateSpy = jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('03-15-2024'));
  expect(functions.determinePayPeriod()).toBe(15);
});

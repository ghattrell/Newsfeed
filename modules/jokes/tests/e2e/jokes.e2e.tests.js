'use strict';

describe('Jokes E2E Tests:', function () {
  describe('Test Jokes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/jokes');
      expect(element.all(by.repeater('joke in jokes')).count()).toEqual(0);
    });
  });
});

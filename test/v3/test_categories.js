"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;
const sinon = require('sinon');

const db = require('./lib/mock-db');
const categories = require('../../api/v3/categories/categories');

chai.use(chai_as_promised);

suite('categories', function () {
  suite('getCategories', function () {
    test('list categories without expansion', function () {
      const req = {query: {}};

      const spy = sinon.spy();
      const res = {json: spy};

      return categories.getCategories(db, req, res)
        .then(() => {
          const actual = spy.args[0][0];
          const expected = [
            {
              id: 1,
              name: 'category-1-name',
              description: 'category-1-description',
              problems: {
                href: 'undefined/categories/1/problems'
              }
            },
            {
              id: 2,
              name: 'category-2-name',
              description: 'category-2-description',
              problems: {
                href: 'undefined/categories/2/problems'
              }
            }
          ];

          return assert.deepEqual(actual, expected);
        });
    });

    test('list categories with expansion', function () {
      const req = {
        query: {
          expand: 'problems'
        }
      };

      const spy = sinon.spy();
      const res = {
        json: spy
      };

      return categories.getCategories(db, req, res)
        .then(() => {
          const actual = spy.args[0][0];
          const expected = [
            {
              id: 1,
              name: 'category-1-name',
              description: 'category-1-description',
              problems: [
                {
                  id: 1,
                  category_id: 1,
                  title: 'problem-1-title',
                  description: 'problem-1-description',
                  test_cases: {
                    href: 'undefined/problems/1/test-cases'
                  }
                },
                {
                  id: 2,
                  category_id: 2,
                  title: 'problem-2-title',
                  description: 'problem-2-description',
                  test_cases: {
                    href: 'undefined/problems/2/test-cases'
                  }
                }
              ]
            },
            {
              id: 2,
              name: 'category-2-name',
              description: 'category-2-description',
              problems: [
                {
                  id: 3,
                  category_id: 3,
                  title: 'problem-3-title',
                  description: 'problem-3-description',
                  test_cases: {
                    href: 'undefined/problems/3/test-cases'
                  }
                },
                {
                  id: 4,
                  category_id: 4,
                  title: 'problem-4-title',
                  description: 'problem-4-description',
                  test_cases: {
                    href: 'undefined/problems/4/test-cases'
                  }
                }
              ]
            }
          ];

          return assert.deepEqual(actual, expected);
        });
    });
  });

  suite('getCategory', function () {
    test('retrieve existing category without expansion', function () {
      const req = {
        params: {id: 1},
        query: {}
      };

      const spy = sinon.spy();
      const res = {json: spy};

      return categories.getCategory(db, req, res)
        .then(() => {
          const actual = spy.args[0][0];
          const expected = {
            id: 1,
            name: 'category-1-name',
            description: 'category-1-description',
            problems: {
              href: 'undefined/categories/1/problems'
            }
          };

          return assert.deepEqual(actual, expected);
        });
    });

    test('retrieve existing category with expansion', function () {
      const req = {
        params: {
          id: 1
        },
        query: {
          expand: 'problems'
        }
      };

      const spy = sinon.spy();
      const res = {
        json: spy
      };


      return categories.getCategory(db, req, res)
        .then(() => {
          const actual = spy.args[0][0];
          const expected = {
            id: 1,
            name: 'category-1-name',
            description: 'category-1-description',
            problems: [
              {
                id: 1,
                category_id: 1,
                title: 'problem-1-title',
                description: 'problem-1-description',
                test_cases: {
                  href: 'undefined/problems/1/test-cases'
                }
              },
              {
                id: 2,
                category_id: 2,
                title: 'problem-2-title',
                description: 'problem-2-description',
                test_cases: {
                  href: 'undefined/problems/2/test-cases'
                }
              }
            ]
          };

          return assert.deepEqual(actual, expected);
        });
    });

    test('retrieve nonexistent category', function () {
      const req = {
        params: {id: 3},
        query: {}
      };

      const spy = sinon.spy();
      const res = {
        sendStatus: spy
      };

      return categories.getCategory(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with 404');
        });
    });
  });

  suite('getCategoryProblems', function () {
    test('list problems for existing category without expansion', function () {
      const req = {
        params: {id: 1},
        query: {}
      };

      const spy = sinon.spy();
      const res = {json: spy};

      return categories.getCategoryProblems(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called exactly once')

          const actual = spy.args[0][0];
          const expected = [
            {
              id: 1,
              category_id: 1,
              title: 'problem-1-title',
              description: 'problem-1-description',
              test_cases: {
                href: 'undefined/problems/1/test-cases'
              }
            },
            {
              id: 2,
              category_id: 2,
              title: 'problem-2-title',
              description: 'problem-2-description',
              test_cases: {
                href: 'undefined/problems/2/test-cases'
              }
            }
          ];

          assert.deepEqual(actual, expected);
        });
    });

    test('list problems for nonexistent category', function () {
      const req = {
        params: {id: 3},
        query: {}
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return categories.getCategoryProblems(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called once with status 404');
        });
    });
  });
});
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
            },
            {
              id: 3,
              name: 'category-3-name',
              description: 'category-3-description',
              problems: {
                href: 'undefined/categories/3/problems'
              }
            }
          ];

          return assert.deepEqual(actual, expected);
        });
    });

    test('list categories expanding problems', function () {
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
                  category_id: 1,
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
                  category_id: 2,
                  title: 'problem-3-title',
                  description: 'problem-3-description',
                  test_cases: {
                    href: 'undefined/problems/3/test-cases'
                  }
                },
                {
                  id: 4,
                  category_id: 2,
                  title: 'problem-4-title',
                  description: 'problem-4-description',
                  test_cases: {
                    href: 'undefined/problems/4/test-cases'
                  }
                }
              ]
            },
            {
              id: 3,
              name: 'category-3-name',
              description: 'category-3-description',
              problems: []
            }
          ];

          return assert.deepEqual(actual, expected);
        });
    });

    test('list categories with an unrecognised expand parameter', function () {
      const req = {
        query: {expand: 'something'}
      };

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
            },
            {
              id: 3,
              name: 'category-3-name',
              description: 'category-3-description',
              problems: {
                href: 'undefined/categories/3/problems'
              }
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
                category_id: 1,
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
        params: {id: 4},
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
              category_id: 1,
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
        params: {id: 4},
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

  suite('newCategory', function () {
    test('create a new category', function () {
      const req = {
        body: {
          name: 'category-4-name',
          description: 'category-4-description'
        }
      };

      const spy = sinon.spy();
      const res = {json: spy};

      return categories.newCategory(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'req.json should have been called once');

          const actual = spy.args[0][0];
          const expected = {
            id: 4,
            name: 'category-4-name',
            description: 'category-4-description',
            problems: {href: 'undefined/categories/4/problems'}
          };

          assert.deepEqual(actual, expected);
        });
    });
  });

  suite('editCategory', function () {
    test('edit an existing category', function () {
      const req = {
        params: {id: 1},
        body: {
          name: 'category-1-name',
          description: 'category-1-description'
        }
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return categories.editCategory(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called exactly once');
          assert.strictEqual(spy.args[0][0], 200, 'res.sendStatus should have been called with status 200');
        });
    });

    test('edit a nonexistent category', function () {
      const req = {
        params: {id: 4},
        body: {
          name: 'category-4-name',
          description: 'category-4-description'
        }
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return categories.editCategory(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called exactly once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with status 404');
        });

    });
  });

  suite('newProblem', function () {
    test('create a new problem', function () {
      const req = {
        params: {id: 1},
        body: {
          title: 'title',
          description: 'description'
        }
      };

      const status_spy = sinon.spy();
      const json_spy = sinon.spy();
      const res = {
        status: status_spy,
        json: json_spy
      };

      return categories.newProblem(db, req, res)
        .then(() => {
          assert.isTrue(status_spy.calledOnce, 'res.status should have been called once');
          assert.strictEqual(status_spy.args[0][0], 201, 'res.status should have been called with status 201');
          assert.isTrue(json_spy.calledOnce, 'res.json should have been called once');

          const actual = json_spy.args[0][0];
          const expected = {
            id: 5,
            category_id: 1,
            title: 'title',
            description: 'description',
            test_cases: {
              href: 'undefined/problems/5/test-cases'
            }
          };

          assert.deepEqual(actual, expected);
        })
    });
  });
});
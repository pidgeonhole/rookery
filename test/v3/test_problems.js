"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;
const sinon = require('sinon');

const db = require('./lib/mock-db');
const problems = require('../../api/v3/problems/problems');

suite('problems', function () {
  suite('getProblem', function () {
    test('retrieve an existing problem without expansion', function () {
      const req = {
        params: {id: 1},
        query: {}
      };

      const spy = sinon.spy();
      const res = {json: spy};

      return problems.getProblem(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = {
            id: 1,
            category_id: 1,
            title: 'problem-1-title',
            description: 'problem-1-description',
            test_cases: {
              href: 'undefined/problems/1/test-cases'
            }
          };

          assert.deepEqual(actual, expected);
        });
    });

    test('retrieve a nonexistent problem', function () {
      const req = {
        params: {id: 5},
        query: {}
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return problems.getProblem(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');

          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with code 404');
        });
    });
  });

  suite('getProblemTestCases', function () {
    test('list test cases for an existing problem', function () {
      assert.fail('not implemented');
    });

    test('list test cases for an existing problem without test cases', function () {
      assert.fail('not implemented');
    });

    test('list test cases for a nonexistent problem', function () {
      assert.fail('not implemented');
    });
  });

  suite('newSubmission', function () {
    test('submit an answer to an existing problem with test cases', function () {

    });

    test('submit an answer to an existing problem with no test cases', function () {

    });
  });

  suite('editProblem', function () {
    test('edit an existing problem', function () {

    });

    test('edit an nonexistent problem', function () {

    });
  });

  suite('newTestCase', function () {
    test('create a new test case', function () {

    });
  });
});
"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;
const sinon = require('sinon');

const db = require('./lib/mock-db');
const test_cases = require('../../api/v3/test-cases/test-cases');

suite('test-cases', function () {
  suite('getTestCase', function () {
    test('get existing test case', function () {
      const req = {params: {id: 1}};

      const spy = sinon.spy();
      const res = {json: spy};

      return test_cases.getTestCase(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = {
            id: 1,
            problem_id: 1,
            input: 'test-case-1-input',
            output: 'test-case-1-output',
            types: 'test-case-1-types'
          };

          assert.deepEqual(actual, expected);
        });
    });

    test('get nonexistent test case', function () {
      const req = {params: {id: 6}};

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return test_cases.getTestCase(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called once with status 404');
        });
    });
  });

  suite('editTestCase', function () {
    test('edit existing test case', function () {
      const req = {
        params: {id: 1},
        body: {
          problem_id: 1,
          input: 'test-case-1-input',
          output: 'test-case-1-output',
          types: 'test-case-1-types'
        }
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return test_cases.editTestCase(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 200, 'res.sendStatus should have been called with status 200');
        });
    });

    test('edit nonexistent test case', function () {
      const req = {
        params: {id: 6},
        body: {
          problem_id: 1,
          input: 'test-case-1-input',
          output: 'test-case-1-output',
          types: 'test-case-1-types'
        }
      };
      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return test_cases.editTestCase(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called once with status 404');
        });
    });
  });
});

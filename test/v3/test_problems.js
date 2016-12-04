"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;
const sinon = require('sinon');

const db = require('./lib/mock-db');
const owl = require('./lib/mock-owl');
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
      const req = {params: {id: 1}};

      const spy = sinon.spy();
      const res = {json: spy};

      return problems.getProblemTestCases(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = [
            {
              id: 1,
              problem_id: 1,
              input: 'test-case-1-input',
              output: 'test-case-1-output',
              types: 'test-case-1-types'
            },
            {
              id: 2,
              problem_id: 1,
              input: 'test-case-2-input',
              output: 'test-case-2-output',
              types: 'test-case-2-types'
            }
          ];

          assert.deepEqual(actual, expected);
        });
    });

    test('list test cases for an existing problem without test cases', function () {
      const req = {params: {id: 4}};

      const spy = sinon.spy();
      const res = {json: spy};

      return problems.getProblemTestCases(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = [];

          assert.deepEqual(actual, expected);
        })
    });

    test('list test cases for a nonexistent problem', function () {
      const req = {params: {id: 6}};

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return problems.getProblemTestCases(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with status 404');
        });
    });
  });

  suite('newSubmission', function () {
    test('submit an answer to an existing problem', function () {
      const req = {
        params: {id: 1},
        body: {
          language: 'language',
          source_code: 'source_code',
          name: 'name'
        }
      };

      const status_spy = sinon.spy();
      const json_spy = sinon.spy();
      const res = {
        status: status_spy,
        json: json_spy
      };

      return problems.newProblemSubmission(db, owl, req, res)
        .then(() => {
          assert.isTrue(status_spy.calledOnce, 'res.status should have been called once');
          assert.strictEqual(status_spy.args[0][0], 201, 'res.status should have been called with status 201');
          assert.isTrue(json_spy.calledOnce, 'res.json should have been called once');

          const actual = json_spy.args[0][0];
          const expected = {
            num_tests: 0,
            tests_passed: 0,
            tests_failed: 0,
            tests_errored: 0,
            results: [],
            name: 'name',
            language: 'language',
            time_received: new Date(0).toISOString()
          };

          assert.deepEqual(actual, expected);
        });
    });

    test('submit an answer to a nonexistent problem', function () {
      const req = {
        params: {id: 6},
        body: {
          language: 'language',
          source_code: 'source_code',
          name: 'name'
        }
      };
      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return problems.newProblemSubmission(db, owl, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with status 404');
        });
    });
  });

  suite('editProblem', function () {
    test('edit an existing problem', function () {
      const req = {
        params: {id: 1},
        body: {
          category_id: 1,
          title: 'problem-1-title',
          description: 'problem-1-description'
        }
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return problems.editProblem(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 200, 'res.sendStatus should have been called with status 200');
        });
    });

    test('edit an nonexistent problem', function () {
      const req = {
        params: {id: 6},
        body: {
          category_id: 6,
          title: 'problem-6-title',
          description: 'problem-6-description'
        }
      };

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return problems.editProblem(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with status 200');
        });
    });
  });

  suite('newTestCase', function () {
    test('create a new test case', function () {
      const req = {
        params: {id: 4},
        body: {
          input: 'test-case-5-input',
          output: 'test-case-5-output',
          types: 'test-case-5-types'
        }
      };

      const status_spy = sinon.spy();
      const json_spy = sinon.spy();
      const res = {
        status: status_spy,
        json: json_spy
      };

      return problems.newTestCase(db, req, res)
        .then(() => {
          assert.isTrue(status_spy.calledOnce, 'res.status should have been called once');
          assert.strictEqual(status_spy.args[0][0], 201, 'res.status should have been called with status 201');

          assert.isTrue(json_spy.calledOnce, 'res.json should have been called once');

          const actual = json_spy.args[0][0];
          const expected = {
            id: 5,
            problem_id: 4,
            input: 'test-case-5-input',
            output: 'test-case-5-output',
            types: 'test-case-5-types'
          };

          assert.deepEqual(actual, expected);
        });
    });
  });
});
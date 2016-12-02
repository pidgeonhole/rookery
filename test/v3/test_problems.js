"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;

const db = require('./lib/mock-db');
const problems = require('../../api/v3/problems/problems');

suite('problems', function () {
  suite('getProblem', function () {
    test('retrieve an existing problem', function () {

    });

    test('retrieve a nonexistent problem', function () {

    });
  });

  suite('getProblemTestCases', function () {
    test('list test cases for an existing problem', function () {

    });

    test('list test cases for a nonexistent problem', function () {

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
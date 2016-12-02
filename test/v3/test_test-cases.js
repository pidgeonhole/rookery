"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;

const db = require('./lib/mock-db');
const test_cases = require('../../api/v3/test-cases/test-cases');

suite('test-cases', function () {
  suite('getTestCase', function () {
    test('get existing test case', function () {

    });

    test('get nonexistent test case', function () {

    });
  });

  suite('editTestCase', function () {
    test('edit existing test case', function () {

    });

    test('edit nonexistent test case', function () {

    });
  });
});

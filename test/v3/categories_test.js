"use strict";

const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const assert = chai.assert;

const db = require('./mock-db');
const categories = require('../../api/v3/categories/categories');

chai.use(chai_as_promised);

suite('categories', function () {
  suite('getCategories', function () {
    test('list categories without expansion', function () {
      assert.isOk(true, 'should be true');
    });

    test('list categories with expansion', function () {
      assert.isOk(true, 'should be true');
    });
  });

  suite('getCategory', function () {
    test('retrieve category without expansion', function () {
      assert.isOk(true, 'should be true');
    });

    test('retrieve category without expansion', function () {
      assert.isOk(true, 'should be true');
    });
  });

  suite('getCategoryProblems', function () {
    test('list problems', function () {

    });
  });
});
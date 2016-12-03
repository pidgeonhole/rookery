"use strict";

const debug = require('debug')('rookery:test/api/v3/lib/db');

/**
 * @typedef {object} Category
 * @prop {number} id
 * @prop {string} name
 * @prop {string} description
 */

/**
 * @typedef {object} Problem
 * @prop {number} id
 * @prop {number} category_id
 * @prop {string} title
 * @prop {string} description
 */

/**
 * @typedef {object} TestCase
 * @prop {number} id
 * @prop {number} problem_id
 * @prop {string} input
 * @prop {string} output
 * @prop {string} types
 */

const mock_category = function (id) {
  return {
    id,
    name: `category-${id}-name`,
    description: `category-${id}-description`
  };
};

const mock_problem = function (id, category_id) {
  return {
    id,
    category_id,
    title: `problem-${id}-title`,
    description: `problem-${id}-description`
  };
};

const mock_test_case = function(id, problem_id) {
  return {
    id,
    problem_id,
    input: `test-case-${id}_input`,
    output: `test-case-${id}-output`,
    types: `test-case-${id}-types`
  };
};

/**
 * Get categories from the database
 * @return {Promise.<Category[]>}
 */
function getCategories() {
  return Promise.resolve([1, 2, 3].map(id => mock_category(id)));
}

/**
 * Retrieve a particular category
 * @param {number} id
 * @return {Promise.<Category>}
 */
function getCategory(id) {
  switch (id) {
    case 1:
    case 2:
    case 3:
      return Promise.resolve(mock_category(id));
    default:
      return Promise.resolve(null);
  }
}

/**
 * Get problems for a particular category
 * @param category_id
 * @return {Promise.<Problem[]>}
 */
function getProblems(category_id) {
  switch (category_id) {
    case 1:
      return Promise.resolve([1, 2].map(id => mock_problem(id, category_id)));
    case 2:
      return Promise.resolve([3, 4].map(id => mock_problem(id, category_id)));
    case 3:
      return Promise.resolve([]);
    default:
      return Promise.reject();
  }
}

/**
 * Retrieve a problem by id
 * @param {number} id
 * @return {Promise.<Problem>}
 */
function getProblem(id) {
  switch (id) {
    case 1:
    case 2:
      return Promise.resolve(mock_problem(id, 1));
    case 3:
    case 4:
      return Promise.resolve(mock_problem(id, 2));
    default:
      return Promise.resolve(null);
  }
}

function getTestCases(problem_id) {
  switch (problem_id) {
    case 1:
      return Promise.resolve([1, 2].map(id => mock_test_case(id, problem_id)));
    case 2:
      return Promise.resolve([3, 4].map(id => mock_test_case(id, problem_id)));
    default:
      return Promise.resolve([]);
  }
}

function getTestCase(id) {
  switch (id) {
    case 1:
    case 2:
      return Promise.resolve(mock_test_case(id, 1));
    case 3:
    case 4:
      return Promise.resolve(mock_test_case(id, 2));
    default:
      return Promise.reject();
  }
}

/**
 * Create a new category
 * @param {string} name
 * @param {string} description
 * @return {Promise.<Category>}
 */
function newCategory(name, description) {
  if (name && description) {
    return Promise.resolve(mock_category(4));
  } else {
    return Promise.reject();
  }

}

/**
 * Create a new problem
 * @param category_id
 * @param title
 * @param description
 * @return {Promise.<Problem>}
 */
function newProblem(category_id, title, description) {
  if (category_id && title && description) {
    return Promise.resolve({
      id: 5,
      category_id,
      title,
      description
    });
  } else {
    return Promise.reject();
  }
}

function newTestCase(problem_id, input, output, types) {
  if (problem_id && input && output && types) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

/**
 * Update an existing category
 * @param {number} id
 * @param {string} name
 * @param {string} description
 * @return {Promise}
 */
function updateCategory(id, name, description) {
  if (id && name && description) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

/**
 * Update an existing problem
 * @param {number} id
 * @param {number} category_id
 * @param {string} title
 * @param {string} description
 * @return {Promise}
 */
function updateProblem(id, category_id, title, description) {
  if (id && category_id && title && description) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

function updateTestCase(id, problem_id, input, output, types) {
  if (id && problem_id && input && output && types) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

// todo: deleting

module.exports = {
  mock_category,
  mock_problem,
  mock_test_case,
  getCategories,
  getCategory,
  getProblems,
  getProblem,
  getTestCases,
  getTestCase,
  newCategory,
  newProblem,
  newTestCase,
  updateCategory,
  updateProblem,
  updateTestCase
};
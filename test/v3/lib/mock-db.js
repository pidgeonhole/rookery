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
    input: `test-case-${id}-input`,
    output: `test-case-${id}-output`,
    types: `test-case-${id}-types`
  };
};

const mock_submission = function (id, problem_id) {
  return {
    id,
    problem_id,
    name: `submission-${id}-name`,
    time_received: `submission-${id}-time-received`,
    num_tests: `submission-${id}-num-tests`,
    tests_passed: `submission-${id}-tests-passed`,
    tests_failed: `submission-${id}-tests-failed`,
    tests_errored: `submission-${id}-tests-errored`
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
      return Promise.resolve([{
        id: null,
        category_id: 3
      }]);
    default:
      return Promise.resolve([]);
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
    case 3:
      return Promise.resolve([5, 6]).map(id => mock_test_case(id, problem_id));
    case 4:
      return Promise.resolve([{
        id: null,
        problem_id: 4
      }]);
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
    case 5:
    case 6:
      return Promise.resolve(mock_test_case(id, 3));
    default:
      return Promise.resolve(null);
  }
}

function getTopNamesForProblem(problem_id) {
  switch (problem_id) {
    case 1:
      return Promise.resolve([1, 2].map(id => mock_submission(id, problem_id)));
    case 2:
      return Promise.resolve([{
        problem_id: 2,
        id: null
      }]);
    default:
      return Promise.resolve([]);
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
    return Promise.resolve(mock_test_case(5, problem_id));
  } else {
    return Promise.reject();
  }
}

function newSubmission(problem_id, name, language, source_code) {
  switch (problem_id) {
    case 1:
    case 2:
    case 3:
    case 4:
      return Promise.resolve({
        id: 1,
        time_received: new Date(0).toISOString()
      });
    default:
      return Promise.reject({code: '23503'});
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
    switch (id) {
      case 1:
      case 2:
      case 3:
        return Promise.resolve({rowCount: 1});
      default:
        return Promise.resolve({rowCount: 0});
    }
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
    switch (id) {
      case 1:
      case 2:
      case 3:
      case 4:
        return Promise.resolve({rowCount: 1});
      default:
        return Promise.resolve({rowCount: 0});
    }
  } else {
    return Promise.reject();
  }
}

function updateTestCase(id, problem_id, input, output, types) {
  if (id && problem_id && input && output && types) {
    switch (id) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return Promise.resolve({rowCount: 1});
      default:
        return Promise.resolve({rowCount: 0});
    }  } else {
    return Promise.reject();
  }
}

function updateSubmission(id, num_tests, tests_passed, tests_failed, tests_errored) {
  return Promise.resolve();
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
  getTopNamesForProblem,
  newCategory,
  newProblem,
  newTestCase,
  newSubmission,
  updateCategory,
  updateProblem,
  updateTestCase,
  updateSubmission
};
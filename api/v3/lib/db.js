"use strict";

const debug = require('debug')('rookery:lib/db');
const pgp = require('pg-promise')();

const cn = {
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
};

const db = pgp(cn);

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

/**
 * Get categories from the database
 * @return {Promise.<Category[]>}
 */
function getCategories() {
  return db.any(`
    SELECT id, name, description 
    FROM categories`);
}

/**
 * Get only category names and ids from the database
 * @return {Promise}
 */
function listCategories() {
  return db.any(`
    SELECT id, name
    FROM categories`);
}

/**
 * Retrieve a particular category
 * @param {number} id
 * @return {Promise.<Category>}
 */
function getCategory(id) {
  return db.oneOrNone(`
    SELECT id, name, description
    FROM categories
    WHERE id = $1`,
    id);
}

/**
 * Get problems for a particular category
 * @param category_id
 * @return {Promise.<Problem[]>}
 */
function getProblems(category_id) {
  return db.any(`
    SELECT p.id, c.id as category_id, p.title, p.description
    FROM categories as c LEFT OUTER JOIN problems as p ON c.id = p.category_id
    WHERE c.id = $1`,
    category_id);
}

/**
 * Retrieve a problem by id
 * @param {number} id
 * @return {Promise.<Problem>}
 */
function getProblem(id) {
  return db.oneOrNone(`
    SELECT id, category_id, title, description
    FROM problems
    WHERE id = $1`,
    id);
}

function getTestCases(problem_id) {
  return db.any(`
    SELECT t.id, p.id as problem_id, t.input, t.output, t.types
    FROM problems as p LEFT OUTER JOIN test_cases as t ON p.id = t.problem_id
    WHERE p.id = $1`,
    problem_id);
}

function getTestCase(id) {
  return db.oneOrNone(`
    SELECT id, problem_id, input, output, types
    FROM test_cases
    WHERE id = $1`,
    id);
}

function getTopNamesForProblem(problem_id) {
  return db.any(`
    SELECT a.*
    FROM
      ( SELECT DISTINCT ON (s.name) s.id AS id,
                           p.id AS problem_id,
                           s.name,
                           s.time_received,
                           s.num_tests,
                           s.tests_passed,
                           s.tests_failed,
                           s.tests_errored
       FROM problems AS p
       LEFT OUTER JOIN submissions AS s ON p.id = s.problem_id
       WHERE p.id = $1
       ORDER BY s.name,
                s.tests_passed DESC) AS a
    ORDER BY a.tests_passed DESC,
             a.time_received ASC`,
    problem_id);
}

function getEvents() {
  return db.any(`
    SELECT id, name
    FROM events`);
}

function getEvent(id) {
  return db.oneOrNone(`
    SELECT id, name
    FROM events
    WHERE id = $1`,
    id
  );
}

/**
 * Create a new category
 * @param {string} name
 * @param {string} description
 * @return {Promise.<Category>}
 */
function newCategory(name, description) {
  return db.one(`
    INSERT INTO categories (name, description) 
    VALUES ($1, $2) 
    RETURNING id, name, description`,
    [name, description]);
}

/**
 * Create a new problem
 * @param category_id
 * @param title
 * @param description
 * @return {Promise.<Problem>}
 */
function newProblem(category_id, title, description) {
  return db.one(`
    INSERT INTO problems (category_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING id, category_id, title, description`,
    [category_id, title, description]);
}

function newTestCase(problem_id, input, output, types) {
  return db.one(`
    INSERT INTO test_cases (problem_id, input, output, types)
    VALUES ($1, $2, $3, $4)
    RETURNING id, problem_id, input, output, types`,
    [problem_id, input, output, types]);
}

function newTestCases(test_cases) {
  let insert;

  try {
    insert = pgp.helpers.insert(test_cases, ['problem_id', 'input', 'output', 'types'], 'test_cases');
  } catch (e) {
    return Promise.reject('invalid data');
  }

  return db.result(insert);
}

function newSubmission(problem_id, name, language, source_code) {
  return db.one(`
    INSERT INTO submissions (problem_id, name, language, source_code)
    VALUES ($1, $2, $3, $4)
    RETURNING id, time_received`,
    [problem_id, name, language, source_code]);
}

function newEvent(name) {
  return db.one(`
    INSERT INTO events (name)
    VALUES ($1)
    RETURNING id, name`,
    name);
}

/**
 * Update an existing category
 * @param {number} id
 * @param {string} name
 * @param {string} description
 * @return {Promise}
 */
function updateCategory(id, name, description) {
  return db.result(`
    UPDATE categories
    SET (name, description) = ($1, $2)
    WHERE id = $3`,
    [name, description, id]);
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
  return db.result(`
    UPDATE problems
    SET (category_id, title, description) = ($1, $2, $3)
    WHERE id = $4`,
    [category_id, title, description, id]);
}

function updateTestCase(id, problem_id, input, output, types) {
  return db.none(`
    UPDATE test_cases
    SET (problem_id, input, output, types) = ($1, $2, $3, $4)
    WHERE id = $5`,
    [problem_id, input, output, types, id]);
}

function updateSubmission(id, num_tests, tests_passed, tests_failed, tests_errored) {
  return db.none(`
    UPDATE submissions
    SET (num_tests, tests_passed, tests_failed, tests_errored) = ($1, $2, $3, $4)
    WHERE id = $5`,
    [num_tests, tests_passed, tests_failed, tests_errored, id]);
}

// todo: deleting

module.exports = {
  getCategories,
  listCategories,
  getCategory,
  getProblems,
  getProblem,
  getTestCases,
  getTestCase,
  getTopNamesForProblem,
  getEvents,
  getEvent,
  newCategory,
  newProblem,
  newTestCase,
  newTestCases,
  newSubmission,
  newEvent,
  updateCategory,
  updateProblem,
  updateTestCase,
  updateSubmission
};
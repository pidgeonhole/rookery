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
    SELECT id, category_id, title, description
    FROM problems 
    WHERE category_id = $1`,
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
    SELECT id, problem_id, input, output, types
    FROM test_cases
    WHERE problem_id = $1`,
    problem_id);
}

function getTestCase(id) {
  return db.oneOrNone(`
    SELECT id, problem_id, input, output, types
    FROM test_cases
    WHERE id = $1`,
    id);
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

/**
 * Update an existing category
 * @param {number} id
 * @param {string} name
 * @param {string} description
 * @return {Promise}
 */
function updateCategory(id, name, description) {
  return db.none(`
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
  return db.none(`
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

// todo: deleting

module.exports = {
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
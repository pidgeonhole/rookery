"use strict";

/**
 * @typedef {object} OwlResult
 * @prop {number} num_tests
 * @prop {number} tests_passed
 * @prop {number} tests_failed
 * @prop {number} tests_errored
 * @prop {object[]} results
 */

/**
 * Submit a new job to Owl
 * @param {string} language
 * @param {string} source_code
 * @param {object[]} test_cases
 * @param {boolean} debug
 * @return {Promise.<OwlResult>}
 */
function newJob(language, source_code, test_cases, debug) {
  return {
    num_tests: 0,
    tests_passed: 0,
    tests_failed: 0,
    tests_errored: 0,
    results: []
  };
}

module.exports = {
  newJob
};

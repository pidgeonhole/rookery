"use strict";

const request = require('request');

const owl_endpoint = process.env.OWL_ENDPOINT || 'http://owl.pidgeonhole.space:3001';

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
  const job = {
    language,
    source_code,
    test_cases,
    debug
  };

  return new Promise((resolve, reject) => request.post({
      uri: owl_endpoint,
      body: job,
      json: true
    },
    (err, res, body) => {
      if (err) {
        return reject(err);
      } else if (res.statusCode >= 400) {
        return reject(body);
      } else {
        return resolve(body);
      }
    }));
}

module.exports = {
  newJob
};

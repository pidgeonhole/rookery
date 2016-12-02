"use strict";

const debug = require('debug')('rookery:api/v3/problems');
const request = require('request');

const Problem = require('../types/Problem');

function getProblem(db, req, res) {
  const id = req.params.id;

  return db.getProblem(id)
    .then(problem => {
      problem = new Problem(problem);
      return res.json(problem);
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function getProblemTestCases(db, req, res) {
  const problem_id = req.params.id;

  return db.getTestCases(problem_id)
    .then(test_cases => res.json(test_cases))
    .catch(err => {
      debug(err);
      res.sendStatus(500);
    });
}

function newProblemSubmission(db, req, res) {
  const problem_id = req.params.id;

  const language = req.body.language;
  const source_code = req.body.source_code;
  const name = req.body.name;
  const debug_output = !!req.body.debug;

  if (!language || !source_code || !name) {
    return res.sendStatus(400);
  }

  // record submission in database
  return db.newSubmission(problem_id, name, language, source_code)
    .then(id => db.getTestCases(problem_id)
      .then(test_cases => {
        const job = {
          language,
          source_code,
          test_cases,
          debug: debug_output
        };

        return new Promise((resolve, reject) => request.post({
            uri: `${process.env.OWL_ENDPOINT}`,
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
      })
      .then(result => {
        // update db entry with results
        const {num_tests, tests_passed, tests_failed, tests_errored} = result;
        return db.updateSubmission(id, num_tests, tests_passed, tests_failed, tests_errored)
          .then(() => result);
      })
    )
    .then(result => res.json(result))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function editProblem(db, req, res) {
  const id = req.params.id;
  const category_id = req.body.category_id;
  const title = req.body.title;
  const description = req.body.description;

  if (!category_id || !title || !description) {
    return res.sendStatus(400);
  }

  return db.updateProblem(id, category_id, title, description)
    .then(() => res.sendStatus(200))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function newTestCase(db, req, res) {
  const problem_id = req.params.id;
  const input = req.body.input;
  const output = req.body.output;
  const types = req.body.types;

  if (!input || !output || !types) {
    return res.sendStatus(400);
  }

  return db.newTestCase(problem_id, input, output, types)
    .then(test_case => res.json(test_case))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

module.exports = {
  getProblem,
  getProblemTestCases,
  newProblemSubmission,
  editProblem,
  newTestCase
};

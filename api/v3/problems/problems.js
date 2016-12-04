"use strict";

const debug = require('debug')('rookery:api/v3/problems');
const request = require('request');

const Problem = require('../types/Problem');

function getProblem(db, req, res) {
  const id = req.params.id;

  return db.getProblem(id)
    .then(problem => {
      if (problem === null) {
        return res.sendStatus(404);
      }

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

function newProblemSubmission(db, owl, req, res) {
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
    .then(submission_result => db.getTestCases(problem_id)
      .then(test_cases => owl.newJob(language, source_code, test_cases, debug_output))
      .then(response => {
        // update db entry with results
        const {num_tests, tests_passed, tests_failed, tests_errored} = response;
        return db.updateSubmission(submission_result.id, num_tests, tests_passed, tests_failed, tests_errored)
          .then(() => {
            response.name = name;
            response.language = language;
            response.time_received = submission_result.time_received;
            return response;
          });
      })
    )
    .then(result => {
      res.status(201);
      return res.json(result);
    })
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
    .then(test_case => {
      res.status(201);
      return res.json(test_case);
    })
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

"use strict";

const debug = require('debug')('rookery:api/v3/test-cases');

function newTestCase(db, req, res) {
  const {problem_id, input, output, types} = req.body;

  if (!problem_id || !input || !output || !types) {
    return res.sendStatus(400);
  }

  return db.newTestCase(problem_id, input, output, types)
    .then(_ => res.sendStatus(201))

    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function newTestCases(db, req, res) {
  const new_test_cases = req.body;

  return db.newTestCases(new_test_cases)
    .then(_ => res.sendStatus(201))
    .catch(err => {
      if (err === 'invalid data') {
        return res.sendStatus(400);
      }

      debug(err);
      return res.sendStatus(500);
    });
}

function getTestCase(db, req, res) {
  const id = req.params.id;

  return db.getTestCase(id)
    .then(test_case => {
      if (test_case === null) {
        return res.sendStatus(404);
      }

      res.json(test_case)
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function editTestCase(db, req, res) {
  const id = req.params.id;
  const {problem_id, input, output, types} = req.body;

  if (!problem_id || !input || !output || !types) {
    return res.sendStatus(400);
  }

  return db.updateTestCase(id, problem_id, input, output, types)
    .then(result => {
      if (result.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.sendStatus(200);
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

module.exports = {
  getTestCase,
  newTestCase,
  newTestCases,
  editTestCase
};

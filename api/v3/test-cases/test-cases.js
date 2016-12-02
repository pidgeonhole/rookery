"use strict";

const debug = require('debug')('rookery:api/v3/test-cases');

function getTestCase(db, req, res) {
  const id = req.params.id;

  return db.getTestCase(id)
    .then(test_case => res.json(test_case))
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
    .then(() => res.sendStatus(200))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

module.exports = {
  getTestCase,
  editTestCase
};

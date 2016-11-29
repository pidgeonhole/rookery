"use strict";

const debug = require('debug')('rookery:api/v3/problems');
const express = require('express');
const router = express.Router();
const request = require('request');

// const auth = require('../lib/auth');
const db = require('../lib/db');

const Problem = require('../types/Problem');

// router.use(auth.authenticate);

router.get('/:id', (req, res) => {
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
});

router.get('/:id/test-cases', (req, res) => {
  const problem_id = req.params.id;

  return db.getTestCases(problem_id)
    .then(test_cases => res.json(test_cases))
    .catch(err => {
      debug(err);
      res.sendStatus(500);
    });
});

router.post('/:id/submissions', (req, res) => {
  const problem_id = req.params.id;

  const language = req.body.language;
  const source_code = req.body.source_code;
  const debug_output = req.body.debug || false;

  if (!language || !source_code) {
    return res.sendStatus(400);
  }

  return db.getTestCases(problem_id)
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
    .then(result => res.json(result))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
});

// middleware to check that the req.rookery.user.groups object contains instructor
// router.use((req, res, next) => {
//   if (req.rookery.user.groups.includes('instructors')) {
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// });

router.put('/:id', (req, res) => {
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
});

router.post('/:id/test-cases', (req, res) => {
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
});

module.exports = router;

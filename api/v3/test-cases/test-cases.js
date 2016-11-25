"use strict";

const debug = require('debug')('rookery:api/v3/test-cases');
const express = require('express');
const router = express.Router();

const auth = require('../lib/auth');
const db = require('../lib/db');

// use middleware from lib/auth to authenticate request and populate req.rookery.user.groups object
// router.use(auth.authenticate);

router.get('/:id', (req, res) => {
  const id = req.params.id;

  return db.getTestCase(id)
    .then(test_case => res.json(test_case))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
});

// // middleware to check that the req.rookery.user.groups object contains instructor
// router.use((req, res, next) => {
//   if (req.rookery.user.groups.includes('instructors')) {
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// });

router.put('/:id', (req, res) => {
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
});

module.exports = router;

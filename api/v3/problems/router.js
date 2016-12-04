"use strict";

const express = require('express');
const router = express.Router();

const problems = require('./problems');
// const auth = require('../lib/auth');
const db = require('../lib/db');
const owl = require('../lib/owl');

// router.use(auth.authenticate);

router.get('/:id', (req, res) => problems.getProblem(db, req, res));

router.get('/:id/test-cases', (req, res) => problems.getProblemTestCases(db, req, res));

router.post('/:id/submissions', (req, res) => problems.newProblemSubmission(db, owl, req, res));

// middleware to check that the req.rookery.user.groups object contains instructor
// router.use((req, res, next) => {
//   if (req.rookery.user.groups.includes('instructors')) {
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// });

router.put('/:id', (req, res) => problems.editProblem(db, req, res));

router.post('/:id/test-cases', (req, res) => problems.newTestCase(db, req, res));

module.exports = router;

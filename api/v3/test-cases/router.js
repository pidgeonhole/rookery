"use strict";

const debug = require('debug')('rookery:api/v3/test-cases');
const express = require('express');
const router = express.Router();

// const auth = require('../lib/auth');
const test_cases = require('./test-cases');
const db = require('../lib/db');

// use middleware from lib/auth to authenticate request and populate req.rookery.user.groups object
// router.use(auth.authenticate);

router.get('/:id', (req, res) => test_cases.getTestCase(db, req, res));

// // middleware to check that the req.rookery.user.groups object contains instructor
// router.use((req, res, next) => {
//   if (req.rookery.user.groups.includes('instructors')) {
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// });

router.put('/:id', (req, res) => test_cases.editTestCase(db, req, res));

module.exports = router;

"use strict";

const express = require('express');
const router = express.Router();

const version = require('../../package.json').version;

// const login = require('./login/login');
const categories = require('./categories/router');
const problems = require('./problems/router');
const test_cases = require('./test-cases/router');

// middleware to create rookery namespace on request object
// router.use((req, res, next) => {
//   req.rookery = req.rookery || {};
//   next();
// });

// router.use('/login', login);
router.use('/categories', categories);
router.use('/problems', problems);
router.use('/test-cases', test_cases);

// version
router.get('/version', (req, res) => {
  res.type('text/plain').send(version);
});

module.exports = router;

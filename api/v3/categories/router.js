"use strict";

const express = require('express');
const router = express.Router();

// const auth = require('../lib/auth');
const categories = require('./categories');
const db = require('../lib/db');

// use middleware from lib/auth to authenticate request and populate req.rookery.user.groups object
// router.use(auth.authenticate);

router.get('/', (req, res) => categories.getCategories(db, req, res));

router.get('/:id', (req, res) => categories.getCategory(db, req, res));

router.get('/:id/problems', (req, res) => categories.getCategoryProblems(db, req, res));

// middleware to check that the req.rookery.user.groups object contains instructor
// router.use((req, res, next) => {
//   if (req.rookery.user.groups.includes('instructors')) {
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// });

router.post('/', (req, res) => categories.newCategory(db, req, res));

router.put('/:id', (req, res) => categories.editCategory(db, req, res));

router.post('/:id/problems', (req, res) => categories.newProblem(db, req, res));

module.exports = router;

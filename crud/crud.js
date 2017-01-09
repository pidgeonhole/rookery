"use strict";

const express = require('express');
const router = express.Router();
const db = require('../api/v3/lib/db');
const categories = require('../api/v3/categories/categories');
const problems = require('../api/v3/problems/problems');

router.get('/', (req, res) => {
  return res.redirect('/crud/categories');
});

router.get('/categories', (req, res) => {
  return db.getCategories()
    .then(categories => res.render('categories', {
      title: 'Categories',
      categories
    }));
});

router.get('/categories/:id', (req, res) => {
  const id = req.params.id;

  return Promise.all([db.getCategory(id), db.getProblems(id)])
    .then(([category, problems]) => res.render('category', {
      title: category.name,
      category,
      problems
    }));
});

router.get('/problems/:id', (req, res) => {
  const id = req.params.id;

  return db.getProblem(id)
    .then(problem => res.render('problem', {
      title: problem.title,
      problem
    }));
});

module.exports = router;

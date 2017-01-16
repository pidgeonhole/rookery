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

router.get('/categories/new', (req, res) => {
  return res.render('new-category', {title: 'Create new category'});
});

router.post('/categories/new', (req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }

  return db.newCategory(name, description)
    .then(_ => res.redirect('/crud/categories'))
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    });
});

router.get('/categories/:id/problems/new', (req, res) => {
  const category_id = req.params.id;

  return db.listCategories()
    .then(c => res.render('new-problem', {
      title: 'New problem',
      category_id,
      categories: c
    }));
});

router.get('/categories/:id/edit', (req, res) => {
  const id = req.params.id;

  return db.getCategory(id)
    .then(c => res.render('edit-category', {
      category: c
    }))
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    });
});

router.post('/categories/:id/update', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }

  return db.updateCategory(id, name, description)
    .then(_ => res.redirect('/crud/categories/' + id))
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    });
});

router.get('/categories/:id', (req, res) => {
  const id = req.params.id;

  return Promise.all([db.getCategory(id), db.getProblems(id)])
    .then(([category, problems]) => res.render('category', {
      title: category.name,
      id,
      category,
      problems
    }));
});

router.get('/problems/:id/edit', (req, res) => {
  const id = req.params.id;

  return Promise.all([db.listCategories(), db.getProblem(id)])
    .then(([c, p]) => res.render('edit-problem', {
      title: 'Edit problem',
      categories: c,
      problem: p
    }));
});

router.post('/problems/:id/update', (req, res) => {
  const id = req.params.id;
  const category_id = req.body.category_id;
  const title = req.body.title;
  const description = req.body.description;

  if (!category_id || !title || !description) {
    return res.sendStatus(400);
  }

  return db.updateProblem(id, category_id, title, description)
    .then(result => {
      if (result.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.redirect('/crud/problems/' + id);
    })
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    });
});

router.post('/problems/new', (req, res) => {
  const category_id = req.body.category_id;
  const title = req.body.title;
  const description = req.body.description;

  if (!title || !description) {
    return res.sendStatus(400);
  }

  return db.newProblem(category_id, title, description)
    .then(_ => res.redirect('crud/categories/' + category_id));
});

router.get('/problems/:id/test-cases/new', (req, res) => {
  const problem_id = req.params.id;

  return res.render('new-test-case', {
    title: 'New Test Case',
    problem_id
  });
});

router.post('/problems/:id/test-cases/new', (req, res) => {
  const problem_id = req.params.id;
  const input = req.body.input;
  const output = req.body.output;
  const types = req.body.types;

  if (!input || !output || !types) {
    return res.sendStatus(400);
  }

  return db.newTestCase(problem_id, input, output, types)
    .then(test_case => res.redirect('/crud/problems/' + problem_id));
});

router.get('/problems/:id', (req, res) => {
  const id = req.params.id;

  return Promise.all([db.getProblem(id), db.getTestCases(id)])
    .then(([problem, test_cases]) => {
      console.log(test_cases);
      return db.getCategory(problem.category_id)
        .then(category => res.render('problem', {
          title: problem.title,
          id,
          problem,
          category,
          test_cases
        }))
    });
});

router.get('/test-cases/:id', (req, res) => {
  const id = req.params.id;

  return db.getTestCase(id)
    .then(test_case => {
      return db.getProblem(test_case.problem_id)
        .then(problem => res.render('test-case', {
          title: 'Test Case ' + test_case.id,
          test_case,
          problem
        }));
    })
});

module.exports = router;

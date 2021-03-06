"use strict";

const debug = require('debug')('rookery:api/v3/categories');

const Category = require('../types/Category');
const Problem = require('../types/Problem');

function getCategories(db, req, res) {
  const expand = req.query.expand ? req.query.expand.split(',') : null;

  return db.getCategories()
    .then(categories => {
      categories = categories.map(category => new Category(category));

      if (expand && expand.includes('problems')) {
        categories = categories.map(category => category.expand(db, ['problems']));
        return Promise.all(categories)
          .then(categories => res.json(categories));
      }

      return res.json(categories);
    })

    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function getCategory(db, req, res) {
  const id = req.params.id;
  const expand = (req.query.expand || '').split(',');

  return db.getCategory(id)
    .then(category => {
      if (category === null) {
        return res.sendStatus(404);
      }

      category = new Category(category);

      if (expand.includes('problems')) {
        return category.expand(db, ['problems'])
          .then(category => res.json(category));
      }

      return res.json(category);
    })

    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function getCategoryProblems(db, req, res) {
  const category_id = req.params.id;

  return db.getProblems(category_id)
    .then(problems => {
      if (problems.length === 0) {
        return res.sendStatus(404);
      }

      if (problems.length === 1 && problems[0].id === null) {
        return res.json([]);
      }

      problems = problems.map(problem => new Problem(problem));
      return res.json(problems);
    })

    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function newCategory(db, req, res) {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }

  return db.newCategory(name, description)
    .then(category => {
      category = new Category(category);
      return res.json(category);
    })

    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

function editCategory(db, req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }

  return db.updateCategory(id, name, description)
    .then(result => {
      if (result.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.sendStatus(200);
    })
    .catch(err => {
      debug(err);
      res.sendStatus(500);
    });
}

function newProblem(db, req, res) {
  const category_id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;

  if (!title || !description) {
    return res.sendStatus(400);
  }

  return db.newProblem(category_id, title, description)
    .then(problem => {
      problem = new Problem(problem);
      res.status(201);
      return res.json(problem);
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

module.exports = {
  getCategories,
  getCategory,
  getCategoryProblems,
  newCategory,
  editCategory,
  newProblem
};
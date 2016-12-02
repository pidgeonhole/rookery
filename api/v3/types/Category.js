"use strict";

const Problem = require('./Problem');

class Category {
  constructor({id, name, description}) {
    this.id = id;
    this.name = name;
    this.description = description;

    this.problems = {
      href: `${process.env.BASE_PATH}/categories/${id}/problems`
    }
  }

  expand(db, properties) {
    if (properties.includes('problems')) {
      return db.getProblems(this.id)
        .then(problems => {
          problems = problems.map(problem => new Problem(problem));
          this.problems = problems;
          return this;
        });
    }

    return Promise.resolve(this);
  }

}

module.exports = Category;
"use strict";

class Problem {
  constructor({id, category_id, title, description}) {
    this.id = id;
    this.category_id = category_id;
    this.title = title;
    this.description = description;

    this.test_cases = {
      href: `${process.env.BASE_PATH}/problems/${id}/test-cases`
    }
  }
}

module.exports = Problem;

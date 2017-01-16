"use strict";

const debug = require('debug')('rookery:api/v3/events');

function getEvents(db, req, res) {
  return db.getEvents()
    .then(events => res.json(events))
    .catch(err => {
      debug(err);
      res.sendStatus(500);
    });
}

function getEvent(db, req, res) {
  const id = req.params.id;

  return db.getEvent(id)
    .then(event => {
      if (event === null) {
        return res.sendStatus(404);
      }

      return res.json(event);
    });
}

function newEvent(db, req, res) {
  const name = req.body.name;
  
  if (!name) {
    return res.sendStatus(400);
  }

  return db.newEvent(name)
    .then(event => res.json(event))
    .catch(err => {
      debug(err);
      return res.sendStatus(500);
    });
}

module.exports = {
  getEvents,
  getEvent,
  newEvent
};

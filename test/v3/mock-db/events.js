"use strict";

function mock_event(id) {
  return {
    id,
    name: `event-${id}`
  };
}

function getEvents() {
  return Promise.resolve([1, 2].map(id => mock_event(id)));
}

function getEvent(id) {
  switch (id) {
    case 1:
    case 2:
      return Promise.resolve(mock_event(id));
    default:
      return Promise.resolve(null);
  }
}

function newEvent(name) {
  if (!name) {
    return Promise.reject();
  }

  return Promise.resolve({
    id: 3,
    name
  });
}

module.exports = {
  getEvents,
  getEvent,
  newEvent
};
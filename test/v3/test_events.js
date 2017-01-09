"use strict";

const chai = require("chai");
const assert = chai.assert;
const sinon = require('sinon');

const db = require('./mock-db/events');
const events = require('../../api/v3/events/events');

suite('events', function () {
  suite('getEvents', function () {
    test('list events', function () {
      const req = {};

      const spy = sinon.spy();
      const res = {json: spy};

      return events.getEvents(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = [
            {
              id: 1,
              name: 'event-1'
            },
            {
              id: 2,
              name: 'event-2'
            }
          ];

          assert.deepEqual(actual, expected);
        });
    });
  });

  suite('getEvent', function () {
    test('get existing event', function () {
      const req = {params: {id: 1}};

      const spy = sinon.spy();
      const res = {json: spy};

      return events.getEvent(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.json should have been called once');

          const actual = spy.args[0][0];
          const expected = {
            id: 1,
            name: 'event-1'
          };

          assert.deepEqual(actual, expected);
        });
    });

    test('get nonexistent event', function () {
      const req = {params: {id: 3}};

      const spy = sinon.spy();
      const res = {sendStatus: spy};

      return events.getEvent(db, req, res)
        .then(() => {
          assert.isTrue(spy.calledOnce, 'res.sendStatus should have been called once');
          assert.strictEqual(spy.args[0][0], 404, 'res.sendStatus should have been called with status 404');
        });
    });
  });

  suite('newEvent', function () {
    test('create event', function () {
      const req = {body: {name: 'event-3'}};

      const status_spy = sinon.spy();
      const json_spy = sinon.spy();
      const res = {
        status: status_spy,
        json: json_spy
      };

      return events.newEvent(db, req, res)
        .then(() => {
          assert.isTrue(status_spy.calledOnce, 'res.status should have been called once');
          assert.strictEqual(status_spy.args[0][0], 201, 'res.status should have been called with status 201');

          assert.isTrue(json)
        });
    });
  });
});
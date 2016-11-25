"use strict";

const debug = require('debug')('rookery:api/v3/login');
const express = require('express');
const router = express.Router();

const auth = require('../lib/auth');

// instructor login
router.post('/instructor', (req, res) => {
  const userid = req.body.userid || '';
  const password = req.body.password || '';

  return auth.authenticateUser(userid, password)
    .then(account => auth.isInstructor(account))
    .then(isInstructor => {
      if (isInstructor) {
        return auth.generateToken(userid, password)
          .then(result => res.json({
            access_token: result.access_token,
            token_type: result.token_type,
            expires_in: result.expires_in
          }));
      } else {
        return res.sendStatus(401);
      }
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(401);
    });
});

// student login
router.post('/student', (req, res) => {
  const userid = req.body.userid || '';
  const password = req.body.password || '';

  return auth.authenticateUser(userid, password)
    .then(account => auth.isStudent(account))
    .then(isStudent => {
      if (isStudent) {
        return auth.generateToken(userid, password)
          .then(result => res.json({
            access_token: result.access_token,
            token_type: result.token_type,
            expires_in: result.expires_in
          }));
      } else {
        return res.sendStatus(401);
      }
    })
    .catch(err => {
      debug(err);
      return res.sendStatus(401);
    });
});

module.exports = router;

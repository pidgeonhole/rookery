"use strict";

const express = require('express');
const router = express.Router();

const v3 = require('./v3/v3');

router.use('/v3', v3);

module.exports = router;

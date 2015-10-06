'use strict';

var express = require('express');
var controller = require('./chart.controller');

var router = express.Router();

router.get('/', controller.graphSet);


module.exports = router;

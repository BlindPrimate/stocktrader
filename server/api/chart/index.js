'use strict';

var express = require('express');
var controller = require('./chart.controller');

var router = express.Router();

router.get('/:symbol', controller.graphSingle);
router.get('/', controller.graphAll);


module.exports = router;

var express = require('express');
var router = express.Router();

var models = require('../models/models');

router.get('/', function(req, res, next) {
		res.render('file');
});

router.post('/upload', function(req, res, next) {
  res.render('file');
});

module.exports = router;
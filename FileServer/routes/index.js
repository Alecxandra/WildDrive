var express = require('express');
var models = require('../models/models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.username)
		res.redirect('/chat');
	
  res.render('index', { title: 'Express' });
});

router.get('/insert', function(req, res, next) {
	
	var neo = new models.User({ username: 'efgm1024' });
	neo.save();
	console.log();
	console.log(neo.username);
	res.send("Agregado");
});

module.exports = router;

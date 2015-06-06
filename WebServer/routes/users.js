var express = require('express');
var router = express.Router();

var models = require('../models/models');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { title: 'Registrarse', error: null });
});

router.post('/signin', function(req, res, next) {
	models.User.findOne({ username: req.body.username }, function(error, user) {
		if (error)
			console.log(error);
		
		if (user) {
			res.render('signin', { title: 'Registrate', error: 'Usuario ya existe' });	
		}	else {
			var neo = new models.User({ username: req.body.username });
			neo.save();
			res.redirect('/users/signup');
		}
	});
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'Entrar', error: null });
});

router.post('/signup', function(req, res, next) {
	models.User.findOne({ username: req.body.username }, function(error, user) {
		if (error)
			console.log(error);
		
		console.log('User: ' + user);
		
		if (user) {
			req.session.username = user.username;
			console.log('Usurio almacenado: ' + req.session.username);
			res.redirect('/chat');
		} else {
			res.render('signup', { title: 'Entrar', error: 'Usuario inválido. Verifique su usuario' });
		}
			
	});
});

router.post('/signout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;

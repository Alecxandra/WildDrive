var express = require('express');
var router = express.Router();

var models = require('../models/models');

router.get('/', function(req, res, next) {
	if (!req.session.username)
		res.redirect('/');
	console.log('Conectado al chat el user: ' + req.session.username);
	models.Conversation.getAllConversations(req.session.username, function(err, conversations) {
		if (err)
			console.log(err);
		res.render('chat', { title: 'Wildzapp', conversations: conversations, currentUser: req.session.username });
	});
});

router.get('/getUsername', function(req, res, next) {
	if (!req.session.username)
		res.json({ username: null });
	else
		res.json({ username: req.session.username });
});

router.get('/getAllMessages/:from/:to', function(req, res, next) {
	models.Conversation.getAllMessages(req.params.from, req.params.to, function (err, conversation) {
		if (conversation && conversation.messages !== null)
			res.json(conversation.messages);
		else 
			res.json([]);
	});
});

module.exports = router;
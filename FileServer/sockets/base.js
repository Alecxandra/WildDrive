module.exports = function(io) {
	var models = require('../models/models');	
	io.sockets.on('connection', function(socket) {
		socket.on('login', function(data) {
			socket.join(data.username);
		});
		
		socket.on('send message', function(data) {
			console.log(data);
			models.Conversation.getConversation(data.from, data.to, function(err, conversation) {
				if (err)
					console.log(err);
				
				if (!conversation) {
					conversation = new models.Conversation({ from: data.from, to: data.to });
					conversation.save();
				}
				
				conversation.messages.push({ from: data.from, body: data.msg, date: Date.now() });
				conversation.save();
			});
			socket.emit('my message', data.msg);
			io.to(data.to).emit('receive message', data);
		});
	});
}
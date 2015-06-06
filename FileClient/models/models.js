var mongoose = require('mongoose');

/*
var connection = mongoose.connect('mongodb://localhost/wildzapp', function(error) {
	if (error)
		console.log(error);
});
*/
var models = {};

//var Schema = mongoose.Schema;
//------------------------------------------------------
/*
var UserSchema = new Schema({
	username: String
});

models.User = connection.model('users', UserSchema);

var ConversationSchema = new Schema({
	from: String,
	to: String,
	messages: [{ from: String, body: String, date: Date }]
});

ConversationSchema.statics.getAllConversations = function(username, callback) {
	var query = this.find().or([{to: username }, { from: username }]);
	query.exec(callback);
};

ConversationSchema.statics.getAllMessages = function(from_u, to_u, callback) {
	this.findOne({ from: from_u, to: to_u }, callback);
};

ConversationSchema.statics.getConversation = function(from_u, to_u, callback) {
	var query = this.findOne().or([{ to: to_u, from: from_u }, { to: from_u, from: to_u }]);
	query.exec(callback);
};


models.Conversation = connection.model('conversations', ConversationSchema);
*/
//------------------------------------------------------
module.exports = models;



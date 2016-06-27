var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var pollConnection = mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://localhost/polls');
var pollSchema = new Schema({
  title: String,
  user: String,
  options: [{name: String, count: Number, totalVotes: Number }],
  users: [String]
});

var Poll = pollConnection.model('Poll', pollSchema);
module.exports = Poll;

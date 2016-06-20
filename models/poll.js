var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var pollConnection = mongoose.createConnection('mongodb://localhost/polls');
var pollSchema = new Schema({
  title: String,
  user: String,
  options: [{name: String, count: Number, totalVotes: Number }],
  users: [String]
});

var Poll = pollConnection.model('Poll', pollSchema);
module.exports = Poll;

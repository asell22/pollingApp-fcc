var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollConnection = mongoose.createConnection('mongodb://localhost/polls');
var pollSchema = new Schema({
  title: String,
  user: String,
  options: [{name: String, count: Number, totalVotes: Number }]
});

var Poll = pollConnection.model('Poll', pollSchema);
module.exports = Poll;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pollSchema = new Schema({
  title: String,
  user: String,
  options: [{name: String, count: Number, totalVotes: Number }]
});

var Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;

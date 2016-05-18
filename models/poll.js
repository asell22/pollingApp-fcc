var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pollSchema = new Schema({
  title: String,
  user: String,
  options: [{name: String, totalVotes: {type: Number, default: 0}}]
});

var Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;

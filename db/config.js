var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db/mydb');

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function () {
  console.log('we are connected to our mong0db database');
});

module.exports = db;
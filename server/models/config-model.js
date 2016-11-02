var mongoose = require('mongoose'),
    q        = require('q');

var ConfigSchema = mongoose.Schema({
    name: String,
    values: String
});

var Config = mongoose.model('config', ConfigSchema);
var q       = require('q'),
    Queue   = require('../models/queue-model.js');

var queue = {};

queue.createQueue = name => Queue.createQueue(new Queue({name: name}))

queue.getQueue = () => Queue.getQueue()

module.exports = queue;
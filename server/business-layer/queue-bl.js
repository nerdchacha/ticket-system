var q       = require('q'),
    Queue   = require('../models/queue-model.js');

var queue = {};

queue.createQueue = name => Queue.createQueue(new Queue({name: name}))

queue.getQueue = () => Queue.getQueue()

queue.updateQueue = (_id, name) => Queue.updateQueue(_id, name)

module.exports = queue;
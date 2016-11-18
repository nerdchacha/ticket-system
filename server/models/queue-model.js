var mongoose    = require('mongoose'),
    q           = require('q'),
    log      	= require('../config/log4js-config.js');

var QueueSchema = mongoose.Schema({
	name: String,
	users: Array
})

var Queue = mongoose.model('queue', QueueSchema);


function resolve(deferred){
    return (err, data) => {
        if(err) {
            log.error('Error in QUEUE-MODEL -', err);
            deferred.reject(err);
        }
        else deferred.resolve(data);
    }
};

/*-------------------------------------------------------
 CREATE A NEW QUEUE
 PARAMS: 
 [queue - object with new queue details]
 -------------------------------------------------------*/
Queue.createQueue = queue => {
	var deferred = q.defer();
    queue.save(resolve(deferred));
    return deferred.promise;
}

/*-------------------------------------------------------
 GET ALL QUEUE NAMES
 PARAMS: 
 -------------------------------------------------------*/
Queue.getQueue = () => {
	var deferred = q.defer();
    Queue.find(
    	{},
    	{"users" : 0},
    	resolve(deferred)
	);
    return deferred.promise;
}

/*-------------------------------------------------------
 UPDATE THE QUEUE NAMES
 PARAMS:
 [name : new name to be given to the queue] 
 -------------------------------------------------------*/
Queue.updateQueue = (_id,name) => {
	var deferred = q.defer();
    Queue.findOneAndUpdate(
    	{_id: _id},
    	{name : name},
    	{new: true},
    	resolve(deferred)
	);
    return deferred.promise;
}

/*-------------------------------------------------------
ADD USER TO QUEUE
PARAMS: 
[users - array of users to be added]
 -------------------------------------------------------*/
Queue.addUsers = (_id, users) => {
	var deferred = q.defer();
	Queue.findOneAndUpdate(
		{_id: _id},
		{"$addToSet": { "users": {"$each": users}}},
		{new: true},
		resolve(deferred)
	)
    return deferred.promise;
}

/*-------------------------------------------------------
REMOVE USER FROM THE QUEUE
PARAMS: 
[users - array of users to be removed]
 -------------------------------------------------------*/
Queue.removeUsers = (_id, users) => {
	var deferred = q.defer();
	Queue.findOneAndUpdate(
		{_id: _id},
		{"$pull": { "users": {"$each": users}}},
		{new: true},
		resolve(deferred)
	)
    return deferred.promise;
}

module.exports = Queue;
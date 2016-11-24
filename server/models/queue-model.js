var mongoose    = require('mongoose'),
    q           = require('q'),
    log      	= require('../config/log4js-config.js');

var QueueSchema = mongoose.Schema({
	name: String,
	users: [String]
})

var Queue = mongoose.model('queue', QueueSchema);

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
    	resolve(deferred)
	);
    return deferred.promise;
}

/*-------------------------------------------------------
 GET QUEUE DETAILS BY ID
 PARAMS: 
 -------------------------------------------------------*/
Queue.getQueueById = _id => {
    var deferred = q.defer();
    Queue.findOne(
        {_id : _id},
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
UPDATE USER FOR QUEUE
PARAMS: 
[users - array of users to be added]
 -------------------------------------------------------*/
Queue.updateUsers = (_id, userIds) => {
	var deferred = q.defer();
	Queue.findByIdAndUpdate(
		_id,
		{"users": userIds},
		{new: true},
		resolve(deferred)
	)
    return deferred.promise;
}

// /*-------------------------------------------------------
// REMOVE USER FROM THE QUEUE
// PARAMS: 
// [users - array of users to be removed]
//  -------------------------------------------------------*/
// Queue.removeUsers = (_id, userIds) => {
// 	var deferred = q.defer();
// 	Queue.findOneAndUpdate(
// 		{_id: _id},
// 		{"$pull": { "users": {"$each": userIds}}},
// 		{new: true},
// 		resolve(deferred)
// 	)
//     return deferred.promise;
// }


function resolve(deferred){
    return (err, data) => {
        if(err) {
            log.error('Error in QUEUE-MODEL -', err);
            deferred.reject(err);
        }
        else deferred.resolve(data);
    }
};

module.exports = Queue;
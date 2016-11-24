var q       = require('q'),
	User 	= require('../models/user-model.js')
    Queue   = require('../models/queue-model.js');

var queue = {};

queue.createQueue = name => Queue.createQueue(new Queue({name: name}))

queue.getQueueNames = () => Queue.getQueue().then(queues => queues.map(queue => queue.name))

queue.updateQueue = (_id, name) => Queue.updateQueue(_id, name)

queue.updateUser = (_id, addUsers, removeUsers) => q.all(
	Queue.addUsers(_id, addUsers),
	Queue.removeUsers(_id, addUsers)	
)

queue.getQueueUsers = _id => {
	return q.all([
		Queue.getQueueById(_id),
		User.getAllUserDetails()
	])
	.then(values => {
		var queueDetails = values[0];
		var Users 		 = values[1];
		return Users.map(user => {
			return queueDetails.users.indexOf(user._id) > -1 ? {_id: user._id, username: user.username, member: true} : {_id: user._id, username: user.username, member: false}
		}) 
	})
}

queue.updateQueueUsers = (_id, users) => {
	return Queue.updateUsers(_id, users)
	.then(() => q.all([
		Queue.getQueueById(_id),
		User.getAllUserDetails()
	]))
	.then(values => {
		var queueDetails = values[0];
		var Users 		 = values[1];
		return Users.map(user => {
			return queueDetails.users.indexOf(user._id) > -1 ? {_id: user._id, username: user.username, member: true} : {_id: user._id, username: user.username, member: false}
		})
	})
}

module.exports = queue;
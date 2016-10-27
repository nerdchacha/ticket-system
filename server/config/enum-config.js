/**
 * Created by dell on 8/6/2016.
 */

var config = {};

config.roles = {
    user: 'User',
    support: 'Support',
    admin: 'Admin'
};

config.status = {
	new 					: 'New',
	open 					: 'Open',
	awaitingUserResponse 	: 'Awaiting User Response',
	inProgress 				: 'In-Progress',
	resolved 				: 'Resolved',
	closed 					: 'Closed',
	reOpen 					: 'Re-Open'
}

config.priority = {
	low 					: 'Low',
	medium 					: 'Medium',
	high 					: 'High'
}

config.type = {
	bug 					: 'Bug',
	improvement 			: 'Improvement',
	needInfo			 	: 'Need Info'
}

module.exports = config;
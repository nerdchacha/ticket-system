/**
 * Created by dell on 7/27/2016.
 */
var staticModel 	= require('../models/static-model.js'),
	q 				= require('q');

var staticBl = {};

staticBl.getInitialStaticData = (req,res) => {
    var deferred = q.defer();
    staticModel.getStaticValues((err,staticData) => {
       if(err) deferred.reject(err);
        else deferred.resolve(staticData);
    });
    return deferred.promise;
};

module.exports = staticBl;
/**
 * Created by dell on 7/27/2016.
 */
var staticModel = require('../models/static-model.js');
var q = require('q');

var staticBl = {};

staticBl.getInitialStaticData = function(req,res){
    var deferred = q.defer();
    staticModel.getStaticValues(function(err,staticData){
       if(err) deferred.reject(err);
        else deferred.resolve(staticData);
    });
    return deferred.promise;
};

module.exports = staticBl;
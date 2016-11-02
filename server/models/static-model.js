/**
 * Created by dell on 7/27/2016.
 */
var mongoose = require('mongoose'),
    log      = require('../config/log4js-config.js'),
    q        = require('q');

var StaticSchema = mongoose.Schema({
    name:String,
    values:[{
        name:String,
        values:[{
            id:Number,
            value:String,
            status:String,
            allowed:[String]
            }
        ]}
    ]
});

var Static = mongoose.model('static',StaticSchema);

/*-------------------------------------------------------
 GET ALL STATIC VALUES
 PARAMS:
 [callback - callback function to be executed on successfully fetching static values]
 -------------------------------------------------------*/
Static.getStaticValues = function(){
    var deferred = q.defer();
    Static.findOne(
        {'name':'static'},
        resolve(deferred)
    );
    return deferred.promise;
};

function resolve(deferred){
    return (err, data) => {
        if(err) {
            log.error('Error in STATIC-MODEL -', err);
            deferred.reject(err);
        }
        else deferred.resolve(data);
    }
};

module.exports = Static;

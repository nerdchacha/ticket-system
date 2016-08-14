/**
 * Created by dell on 7/27/2016.
 */
var mongoose = require('mongoose');

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
Static.getStaticValues = function(callback){
    Static.findOne({'name':'static'},callback);
};

module.exports = Static;

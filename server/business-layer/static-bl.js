/**
 * Created by dell on 7/27/2016.
 */
var staticModel 	= require('../models/static-model.js'),
	q 				= require('q');

var staticBl = {};

staticBl.getInitialStaticData = (req,res) => staticModel.getStaticValues();

module.exports = staticBl;
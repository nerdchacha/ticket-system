/**
 * Created by dell on 8/2/2016.
 */
var express = require('express');
var router = express.Router();
var adminBl = require('../../business-layer/admin-bl.js');
var helper = require('../../business-layer/helper.js');

router.get('/users-details',function(req,res,next){
    adminBl.fetchAllUsers()
        .then(function(users){
            return helper.createResponseUser(users)
            res.json({users: users, errors: null});
        })
        .catch(function(err){
            res.json({users: null, errors: err});
        });
});

module.exports = router;

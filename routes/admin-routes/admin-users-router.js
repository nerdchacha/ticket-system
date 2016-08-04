/**
 * Created by dell on 8/2/2016.
 */
var express = require('express');
var router = express.Router();
var usersBl = require('../../business-layer/users-bl.js');

router.get('/users-details',function(req,res,next){
    usersBl.getAllUserDetails()
        .then(function(users){
            res.json({users: users, error: null});
        })
        .catch(function(err){
            console.log({users : null, error : err});
        });
});

module.exports = router;

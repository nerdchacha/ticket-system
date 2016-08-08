/**
 * Created by dell on 8/3/2016.
 */
var auth = {};

auth.google = {
    clientID: 'xxxxxx',
    clientSecret: 'xxxxxx',
    callbackURL : 'http://localhost:3000/accounts/auth/google/callback'

};

module.exports = auth;

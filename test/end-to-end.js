var app			  = require('../server/app'),	 
    http		  = require('http'),
    mocha		  = require('mocha'),
    chai		  = require('chai'),
    should 		= chai.should(),
    request 	= require('superagent');

//Configure test server
app.configureMongoose('mongodb://127.0.0.1/test-ticket-system');

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

var server;

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function login(callback){
  var user = request.agent();
  user.post(baseUrl + 'accounts/login')
  .send({username: "admin", password: "admin"})
  .end(function(err, res){
    res.body.isAuthenticated.should.be.ok;
    callback(user);
  })
}

function startServer(){
	server = http.createServer(app);
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);
}

function stopServer(){
	server.close(function(){
		console.log('shutting down test server');
	});
}

startServer();

var baseUrl = 'localhost:5000/';

describe('User Login', () => {
  describe('should not let unregistered user to login', () => {
    it('should return with isAuthenticated flag set to false', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "sudi", password: "admin"})
      .end(function(err, res){
        res.body.isAuthenticated.should.not.be.ok
        done();
      })
    });

    it('should contain a message', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "sudi", password: "admin"})
      .end(function(err, res){
        res.body.should.contain.msg
        done();
      })
    });
  });

  describe('should not let user with wrong password to login', () => {
    it('should return with isAuthenticated flag set to false', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "admin", password: "password"})
      .end(function(err, res){
        res.body.isAuthenticated.should.not.be.ok
        done();
      })
    });

    it('should contain a message', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "admin", password: "password"})
      .end(function(err, res){
        res.body.should.contain.msg
        done();
      })
    });
  });

  describe('should not let user with missing credentials to login', () => {
    it('should return with isAuthenticated flag set to false', (done) => {
      request.post(baseUrl + 'accounts/login', {})
      .end(function(err, res){
        res.body.isAuthenticated.should.not.be.ok
        done();
      })
    });

    it('should contain a message', (done) => {
      request.post(baseUrl + 'accounts/login', {})
      .end(function(err, res){
        res.body.should.contain.msg
        done();
      })
    });
  });

  describe('should let authorized user login', () => {
    it('should have isAuthenticated flag set to true', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "admin", password: "admin"})
      .end(function(err, res){
        res.body.isAuthenticated.should.be.ok;
        done();
      })
    });

    it('should have user object', (done) => {
      request.post(baseUrl + 'accounts/login', {username: "admin", password: "admin"})
      .end(function(err, res){
        res.body.should.contain.user;
        res.body.user.should.contain.username;
        res.body.user.username.should.not.be.empty;
        res.body.user.should.contain.email;
        res.body.user.email.should.not.be.empty;
        res.body.user.should.contain.role;
        res.body.user.role.should.not.be.null;
        res.body.user.role.should.be.an.array;
        res.body.user.role.should.not.be.empty;
        done();
      })
    });
  })
});

describe('Dashboard', () => {
  it('Should retrun ticket count', (done) => {
    login(agent => {
      agent.get(baseUrl + 'admin/dashboard')
      .end((err, res) => {
        res.body.should.contain.tickets;
        res.body.tickets.should.not.be.empty;
        res.body.tickets.should.contain.new;
        res.body.tickets.new.should.not.be.empty;
        res.body.tickets.new.should.contain.count;
        res.body.tickets.new.count.should.not.be.empty;
        res.body.tickets.should.contain.open;
        res.body.tickets.open.should.not.be.empty;
        res.body.tickets.open.should.contain.count;
        res.body.tickets.open.count.should.not.be.empty;
        res.body.tickets.should.contain.inProgress;
        res.body.tickets.inProgress.should.not.be.empty;
        res.body.tickets.inProgress.should.contain.count;
        res.body.tickets.inProgress.count.should.not.be.empty;
        res.body.tickets.should.contain.awaitingUserResponse;
        res.body.tickets.awaitingUserResponse.should.not.be.empty;
        res.body.tickets.awaitingUserResponse.should.contain.count;
        res.body.tickets.awaitingUserResponse.count.should.not.be.empty;
        done();
      });      
    })
  });
});

describe('User Profile', () => {
  it('Should not return user profile', done => {
      login(agent => {
        agent.get(baseUrl + 'users/profile/zztop')
        .end((err, res) => {
            res.body.should.contain.errors;
            res.body.errors.should.be.an.array;

            done();
        });
      });
  });

  it('Should return user profile', done => {
      login(agent => {
        agent.get(baseUrl + 'users/profile/admin')
        .end((err, res) => {
          res.body.should.contain.user;
          res.body.user.should.not.be.empty;
          res.body.user.should.contain.firstname;
          res.body.user.firstname.should.not.be.empty;
          res.body.user.should.contain.lastname;
          res.body.user.lastname.should.not.be.empty;
          res.body.user.should.contain.email;
          res.body.user.email.should.not.be.empty;
          res.body.user.should.contain.role;
          res.body.user.role.should.not.be.empty;
          res.body.user.role.should.be.an.array;
          res.body.user.should.contain.username;
          res.body.user.username.should.not.be.empty;
          res.body.user.should.contain.isActive;
          res.body.user.isActive.should.not.be.empty;
          done();
        });
      });
  });
})
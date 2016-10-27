var app			  = require('../server/app'),	 
    http		  = require('http');
//Configure test server
app.configureMongoose('mongodb://127.0.0.1/test-ticket-system');

var port = normalizePort(process.env.PORT || '6000');
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

startServer();
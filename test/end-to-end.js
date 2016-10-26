var app			= require('../server/app'),
	http		= require('http'),
	mocha		= require('mocha'),
	chai		= require('chai'),
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
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require("http").Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
 // res.render('error', {
    // message: err.message,
    // error: {}
 // });
});


var server = http.listen(5006,function() {
  var host = server.address().address;
  var port = server.address().port
  console.log("CMPE 295 DRDC listening at http://localhost:%s", port);
})

//Socket Code
io.on('connection', function(socket) {
    console.log("Socket connection successful!");

    socket.on('disaster-warning', function(data) {
        console.log("Disaster warning received", data);
        socket.emit('saved-warning', {message:'Saved into database'})
    });
    socket.on('call', function (p1, fn) {
        console.log('client sent ');
        // do something useful
        fn(0, 'some data');
    });
    //TODO: socket disconnect
    socket.on('disconnect', function() {
        console.log("Socket disconnected");
    });

});

process.stdin.resume();

function exitHandler(options, error) {
    if(options.cleanup)  {
        console.log('cleaning up')

    }
    if(options.exit) {
        console.log('exiting');
        process.exit();
    }
    if(error) {
        console.log(error.stack)
    }
}

process.on('exit', exitHandler.bind(null, {cleanup: true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtexception', exitHandler.bind(null, {exit: true}));

module.exports = app;

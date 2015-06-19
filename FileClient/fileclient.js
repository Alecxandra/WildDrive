var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var app = express();
var http = require('http');
var fs = require('fs');
var randtoken = require('rand-token');

var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Socket client

var socket = require('socket.io-client')('http://green-box-37-202764.use1.nitrousbox.com/');

socket.on('connect', function() {
  console.log('Conectado al master');
});

socket.on('sendfile', function(file) {
  var token = randtoken.generate(16);
  fs.writeFile("dfs/" + token + '.' + file.file_ext, file.file_content, function(err) {
    if (err) {
      console.log(err); 
    } else  {
      console.log("Guardado con éxito.");
      socket.emit('filesaved', { url:config.client_url + token + '.' + file.file_ext, dataEntry: file.dataEntry });
    }
  });
});

//Routes



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
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

//------------------------------------------------------------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var io = require('socket.io');
var Schema = require('mongoose').Schema;
var router = express.Router();
var http = require('http');

var models = require('./models/models');

var app = express();

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

// Routes

router.get('/', function(req, res, next) {
		res.render('file');
});

router.post('/upload/:parent_id', [ multer({ dest: './cache/'}), function(req, res){
  console.log(req.body); // form fields
  console.log(req.params); 
  console.log(req.files); // form files
  //mandarlo al server cliente
  models.File.findOne({ _id: req.params.parent_id }).exec(function(err, file) {
    if (err)
      console.log(err);
    var dataEntry = null;
    
    if (file) {
      dataEntry = new models.File({ name: req.files.uploadfile.originalname, _parentfile: file._id, url: null, filetype: 'file' });
    } else {
      dataEntry = new models.File({ name: req.files.uploadfile.originalname, _parentfile: null, url: null, filetype: 'file' });
    }
    
    dataEntry.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Guardado con exito");
      }
    });
    res.render('file');
  });
  //res.status(204).end();
}]);

router.get('/get_tree/:parent_id', function(req, res, next) {
  var parent = null
  
  if (req.params.parent_id != 0) {
     parent = req.params.parent_id;
  }
  
  models.File.find({ _parentfile: parent }).exec(function(err, files) {
    if (err)
      console.log(err);
    var tree_json = [];
    
    files.forEach(function(file) {
      var current_file = {};
      current_file.id = file._id;
      current_file.name = file.name;
      current_file.type = file.filetype;
      current_file.url = file.url;
      
      tree_json.push(current_file);
    });
    
    res.json(tree_json);
  });
});

router.post('/mkdir/:parent_id', function(req, res, next) {
  models.File.findOne({ _id: req.params.parent_id }).exec(function(err, file) {
    if (err)
      console.log(err);
    var dataEntry = null;
    
    if (file)
      dataEntry = new models.File({ name: req.body.folder_name, _parentfile: file._id, url: null, filetype: 'folder' });
    else
      dataEntry = new models.File({ name: req.body.folder_name, _parentfile: null, url: null, filetype: 'folder' });
    dataEntry.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Guardado con exito");
      }
    });
    res.render('file');
  });
});

app.use('/', router);
app.use('/files', router);


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

// Server
var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
io = io.listen(server);


//Socket io
// Socketio
io.sockets.on('connection', function(socket) {
		
});
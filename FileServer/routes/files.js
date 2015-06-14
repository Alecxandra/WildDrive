var express = require('express');
var Schema = require('mongoose').Schema;
var router = express.Router();
var multer  = require('multer');

var models = require('../models/models');

router.get('/', function(req, res, next) {
		res.render('file');
});

router.post('/upload', [ multer({ dest: './cache/'}), function(req, res){
  console.log(req.body); // form fields
  console.log(req.files); // form files
  //mandarlo al server cliente
  models.File.findOne({ _id: req.body.parentfile }).exec(function(err, file) {
    if (err) {
      console.log(err);
    }
    
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

module.exports = router
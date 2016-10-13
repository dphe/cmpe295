/**
 * Created by Roopa on 10/13/16.
 */
var express = require('express');
var router = express.Router();
var app_root = require('app-root-path');
var db = require(app_root.path+'/services/database.js');


router.get('/notifications', function(req, res) {
  console.log("Getting /notifications page");
  res.render('notifications');
});

'use strict';

var Task = require('../models/task');
var Priority = require('../models/priority');
var moment = require('moment');

exports.init = function(req, res){
  Priority.all(function(priorities){
  res.render('tasks/init', {priorities:priorities});
  });
};

exports.create = function(req, res){
  var task = new Task(req.body);
  task.insert(function(){
    res.redirect('/tasks');
  });
};

exports.index = function(req, res){
  Task.find3(req.query, function(tasks){
    Task.pgCount(req.query, function(count){
      res.render('tasks/index', {tasks:tasks, count:count, moment:moment, query:req.query});
    });
  });
};

exports.update = function(req, res){
  Task.update(req.params.id, req.body, function(){
    console.log(req.query);
    res.redirect('/tasks');
  });
};


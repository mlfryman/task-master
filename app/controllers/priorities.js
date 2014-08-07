'use strict';

var Priority = require('../models/priority');

exports.init = function(req, res){
  res.render('priorities/init');
};

exports.index = function(req, res){
  Priority.all(function(priorities){
    res.render('priorities/index', {priorities:priorities});
  });
};

exports.create = function(req, res){
  var priority = new Priority(req.body);
  priority.insert(function(){
    res.redirect('/priorities');
  });
};

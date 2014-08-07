'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');
var async = require('async');
var Priority = require('./priority');

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

function Task(o){
  this.name = o.name;
  this.due = new Date(o.due);
  this.photo = o.photo;
  this.tags = o.tags.split(',').map(function(s){return s.trim();});
  this.priorityId = Mongo.ObjectID(o.priorityId);
  this.isComplete = false;
}

Task.prototype.insert = function(cb){
  Task.collection.save(this, cb);
};

Task.all = function(cb){
  Task.collection.find().toArray(function(err, objects){
    var tasks = objects.map(function(o){
      return changePrototype(o);
    });

    cb(tasks);
  });
};

Task.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Task.collection.findOne({_id:_id}, function(err, obj){
    var task = changePrototype(obj);

    cb(task);
  });
};

Tast
.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Task.collection.findAndRemove({_id:_id}, cb);
};

Task.prototype.addTask = function(newTask, cb){

  this.tasks.push(newTask);
  Task.collection.update({_id:this._id}, {$push:{tasks:newTask}}, cb);
};

module.exports = Task;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}


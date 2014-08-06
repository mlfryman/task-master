'use strict';

var Mongo = require('mongodb');
var _ = require('lodash');

function Task(o){
  this.name = o.name;
  this.tasks = [];
}

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

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

Task.deleteById = function(id, cb){
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


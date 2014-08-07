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

Task.pgCount = function(query, cb){
  var filter = {};
  if(query.filter){filter = {tags:{$in:[query.filter]}};}
  Task.collection.count(filter, function(err, count){
    count = Math.ceil(count / 3);
    cb(count);
  });
};

Task.update = function(id, obj, cb){
  var _id = Mongo.ObjectID(id);
  var val = (obj.completed) ? true : false;
  Task.collection.update({_id:_id}, {$set:{isComplete:val}}, cb);
};

Task.find3 = function(query, cb){
  var options = {limit:3}, filter = {};
  if(query.filter){filter = {tags:{$in:[query.filter]}};}
  if(query.sortBy){
    var sort = (query.order === 'asc') ? -1 : 1;
    options.sort = [[query.sortBy,sort]];
  }
  if(query.page){
    options.skip = ((query.page * 1) - 1) * 3;
  }
  //console.log(filter, options);
  Task.collection.find(filter, options).toArray(function(err, objs){
    var tasks = objs.map(function(o){return changePrototype(o);});
    async.map(tasks, function(task, done){
      Priority.findById(task.priorityId, function(priority){
        task.priority = priority;
        done(null, task);
      });
    }, function(err, newTasks){
      //console.log(newTasks);
      cb(newTasks);
    });
  });
};

module.exports = Task;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}


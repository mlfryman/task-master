'use strict';

var Mongo = require('mongodb');
var _ = require('lodash');

function Priority(o){
  this.name = o.name;
  this.color = o.color;
  this.value = o.value * 1;
}

Object.defineProperty(Priority, 'collection', {
  get: function(){return global.mongodb.collection('priorities');}
});

Priority.prototype.insert = function(cb){
  Priority.collection.save(this, cb);
};

Priority.all = function(cb){
  Priority.collection.find().toArray(function(err, objects){
    var priorities = objects.map(function(o){
      return changePrototype(o);
    });

    cb(priorities);
  });
};

Priority.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Priority.collection.findOne({_id:_id}, function(err, obj){
    var priority = changePrototype(obj);

    cb(priority);
  });
};

module.exports = Priority;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Priority.prototype, obj);
}

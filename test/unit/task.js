/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Task = require('../../app/models/task');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var t1, t2, t3;
var o1 = {name:'get milk'};

describe('Task', function(){
  before(function(done){
    dbConnect('task-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Task.collection.remove(function(){
      t1 = new Task(o1);
      t2 = new Task({name:'work on car'});
      t3 = new Task({name:'clean house'});
      t1.insert(function(){
        t2.insert(function(){
          t3.insert(function(){
            done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Task object', function(){
      t1 = new Task(o1);
      expect(t1).to.be.instanceof(Task);
      expect(t1.name).to.equal('get milk');
    });
  });

  describe('#insert', function(){
    it('should insert a new task', function(done){
      t1 = new Task(o1);
      t1.insert(function(){
        expect(t1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.all', function(){
    it('should get all tasks from database', function(done){
      Task.all(function(tasks){
        t1 = new Task(o1);
        expect(tasks).to.have.length(3);
        expect(tasks[0]).to.be.instanceof(Task);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a task by its id', function(done){
      Task.findById(t1._id.toString(), function(task){
        t1 = new Task(o1);
        expect(task.name).to.equal('get milk');
        expect(t1).to.be.instanceof(Task);
        done();
      });
    });
  });

describe('.deleteById', function(){
    it('should delete a task by its id', function(done){
      Task.deleteById(t1._id.toString(), function(){
        Task.all(function(tasks){
          expect(tasks).to.have.length(2);
          done();
        });
      });
    });
  });

  describe('#addTask', function(){
    it('should add a task to the manager', function(done){
      var t4 = new Task({name:'get gas'});
      t4.insert(function(){
        t4.addTask('get gas', function(){
          expect(t4.tasks).to.have.length(1);
          done();
        });
      });
    });
  });
// Last Braces //
});


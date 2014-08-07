/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Task = require('../../app/models/task');
var Priority = require('../../app/models/priority');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var p1, p2, p3;
var o1 = {name:'high', color:'#D63333', value:'3'};
var o2 = {name:'medium', color:'#FFFF59', value:'2'};
var o3 = {name:'low', color:'#4DB8FF', value:'1'};

var t1, t2, t3, t4, t5, t6;


describe('Task', function(){
  before(function(done){
    dbConnect('task-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Task.collection.remove(function(){
      p1 = new Priority(o1);
      p2 = new Priority(o2);
      p3 = new Priority(o3);
      p1.insert(function(){
        p2.insert(function(){
          p3.insert(function(){
              var to1 = {name:'get milk', due:'3/1/2014', photo:'http://facebook.com/picture.jpg', tags:'food, home, dairy', priorityId: p1._id.toString()};
              var to2 = {name:'return videotapes', due:'6/1/2014', photo:'http://facebook.com/picture.jpg', tags:'movie, rental, fine', priorityId: p2._id.toString()};
              var to3 = {name:'get gas', due:'2/1/2014', photo:'http://facebook.com/picture.jpg', tags:'car, transport, home', priorityId: p3._id.toString()};
              var to4 = {name:'cook dinner', due:'5/1/2014', photo:'http://facebook.com/picture.jpg', tags:'food, home, meal', priorityId: p1._id.toString()};
              var to5 = {name:'achieve nirvana', due:'4/1/2014', photo:'http://facebook.com/picture.jpg', tags:'life, home, zen', priorityId: p2._id.toString()};
              var to6 = {name:'go nuts!', due:'1/1/2014', photo:'http://facebook.com/picture.jpg', tags:'bar, booze, friends', priorityId: p3._id.toString()};
              t1 = new Task(to1);
              t2 = new Task(to2);
              t3 = new Task(to3);
              t4 = new Task(to4);
              t5 = new Task(to5);
              t6 = new Task(to6);

              t2.isComplete = true;

              t1.save(function(){
                t2.save(function(){
                  t3.save(function(){
                    t4.save(function(){
                      t5.save(function(){
                        t6.save(function(){
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

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


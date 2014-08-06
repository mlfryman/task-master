/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Priority = require('../../app/models/priority');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var p1, p2, p3;
var o1 = {name:'high', color:'red', value:'3'};

describe('Priority', function(){
  before(function(done){
    dbConnect('priority-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Priority.collection.remove(function(){
      p1 = new Priority(o1);
      p2 = new Priority({name:'medium', color:'yellow', value:'2'});
      p3 = new Priority({name:'low', color:'blue', value:'1'});
      p1.insert(function(){
        p2.insert(function(){
          p3.insert(function(){
            done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Priority object', function(){
      p1 = new Priority(o1);
      expect(p1).to.be.instanceof(Priority);
      expect(p1.name).to.equal('high');
      expect(p1.color).to.equal('red');
    });
  });

  describe('#insert', function(){
    it('should insert a priority', function(done){
      p1 = new Priority(o1);
      p1.insert(function(){
        expect(p1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
describe('.all', function(){
    it('should get all priorities from database', function(done){
      Priority.all(function(priorities){
        p1 = new Priority(o1);
        expect(priorities).to.have.length(3);
        expect(priorities[0]).to.be.instanceof(Priority);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a priority by its id', function(done){
      Priority.findById(p1._id.toString(), function(priority){
        p1 = new Priority(o1);
        expect(priority.name).to.equal('high');
        expect(p1).to.be.instanceof(Priority);
        done();
      });
    });
  });
});

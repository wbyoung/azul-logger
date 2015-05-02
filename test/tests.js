'use strict';

var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon'); chai.use(require('sinon-chai'));

var observe = require('../index');
var chalk = require('chalk');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var format = function(spy) {
  return util.format.apply(util, spy.getCall(0).args);
};

var output = function(spy) {
  return chalk.stripColor(format(spy));
};

describe('logger', function() {
  it('logs on rawResult event', function() {
    var spy = sinon.spy();
    var query = _.extend({
      sql: 'select 1',
      args: []
    }, EventEmitter.prototype);

    observe(query, { log: spy });

    query.emit('execute');
    query.emit('rawResult', {
      fields: [],
      rows: [],
    });

    expect(spy).to.have.been.calledOnce;
    expect(format(spy)).to.include(chalk.styles.magenta.open);
    expect(format(spy)).to.include(chalk.styles.cyan.open);
    expect(format(spy)).to.not.include(chalk.styles.red.open);
    expect(format(spy)).to.not.include(chalk.styles.yellow.open);
    expect(output(spy)).to.match(/SQL \(\d\.\dms~0rows\) select 1 \[\]/);
  });

  it('logs slow queries', function(done) {
    var spy = sinon.spy();
    var query = _.extend({
      sql: 'select 1',
      args: []
    }, EventEmitter.prototype);

    observe(query, { log: spy, slow: 1 });

    query.emit('execute');
    setTimeout(function() {
      query.emit('rawResult', {
        fields: [],
        rows: [],
      });

      expect(spy).to.have.been.calledOnce;
      expect(format(spy)).to.include(chalk.styles.red.open);
      expect(format(spy)).to.include(chalk.styles.yellow.open);
      expect(format(spy)).to.not.include(chalk.styles.magenta.open);
      expect(format(spy)).to.not.include(chalk.styles.cyan.open);
      expect(output(spy)).to.match(/SQL \(\d\.\dms~0rows\) select 1 \[\]/);
      done();
    }, 5);
  });

  it('observes spawned queries', function() {
    var spy = sinon.spy();
    var original = _.extend({}, EventEmitter.prototype);
    var query = _.extend({
      sql: 'select 1',
      args: []
    }, EventEmitter.prototype);

    observe(original, { log: spy });

    original.emit('spawn', query);
    query.emit('execute');
    query.emit('rawResult', {
      fields: [],
      rows: [],
    });
    expect(spy).to.have.been.calledOnce;
    expect(output(spy)).to.match(/SQL \(\d\.\dms~0rows\) select 1 \[\]/);
  });

  it('observes duped queries', function() {
    var spy = sinon.spy();
    var original = _.extend({}, EventEmitter.prototype);
    var query = _.extend({
      sql: 'select 1',
      args: []
    }, EventEmitter.prototype);

    observe(original, { log: spy });

    original.emit('dup', query);
    query.emit('execute');
    query.emit('rawResult', {
      fields: [],
      rows: [],
    });
    expect(spy).to.have.been.calledOnce;
    expect(output(spy)).to.match(/SQL \(\d\.\dms~0rows\) select 1 \[\]/);
  });

  it('logs on error event', function() {
    var spy = sinon.spy();
    var query = _.extend({
      sql: 'select 1',
      args: []
    }, EventEmitter.prototype);

    observe(query, { log: spy });

    query.emit('execute');
    query.emit('error', new Error('Database Error'));
    expect(spy).to.have.been.calledOnce;
    expect(output(spy)).to.match(/SQL Error: Database Error/);
    expect(format(spy)).to.include(chalk.styles.red.open);
  });
});

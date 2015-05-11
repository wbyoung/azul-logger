'use strict';

var _ = require('lodash');
var chalk = require('chalk');

/**
 * Enabling logging for an Azul.js query & all derived queries.
 *
 * @param {Query} query
 * @param {Object} options
 * @param {Number} options.slow A threshold (in milliseconds) to consider slow
 * SQL statements.
 * @param {Function} options.log A logging function which defaults to
 * console.log.
 */
var observe = module.exports = function(query, options) {
  var opts = _.defaults({}, options, {
    slow: 500,
    log: console.log,
  });
  var log = opts.log;

  var startTime;
  query.on('dup', _.partialRight(observe, options));
  query.on('spawn', _.partialRight(observe, options));
  query.on('execute', function() {
    startTime = process.hrtime();
  });
  query.on('rawResult', function(result) {
    var diff = process.hrtime(startTime);
    var duration = diff[0] * 1e3 + diff[1] * 1e-6;
    var statsColor = chalk.magenta;
    var queryColor = chalk.cyan;

    if (duration > opts.slow) {
      statsColor = chalk.red;
      queryColor = chalk.bold.yellow;
    }

    log(chalk.gray('SQL ') +
      statsColor('(%sms~%srows) ') + queryColor('%s ') + chalk.gray('[%s]'),
      duration.toFixed(1), result.rows.length,
      query.sql, query.args.join(', '));
  });
  query.on('error', function(e) {
    log(chalk.gray('SQL ') +
      chalk.bold.red(e));
  });
};

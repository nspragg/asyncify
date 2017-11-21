'use strict';

const mapLimit = require('./mapLimit');

const CONCURRENCY_LEVEL = 1;

async function mapSeries(iterable, fn) {
  return mapLimit(iterable, fn, CONCURRENCY_LEVEL);
}

module.exports = mapSeries;

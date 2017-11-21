'use strict';

const mapLimit = require('./mapLimit');

const CONCURRENCY_LEVEL = Infinity;

async function map(iterable, fn) {
  return mapLimit(iterable, fn, CONCURRENCY_LEVEL);
}

module.exports = map;

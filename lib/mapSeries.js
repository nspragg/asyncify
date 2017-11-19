'use strict';

const fixedExecutor = require('./private/fixedExecutor');

const CONCURRENCY_LEVEL = 1;

async function mapSeries(iterable, fn) {
  if (!iterable) return [];
  return fixedExecutor(iterable, fn, CONCURRENCY_LEVEL);
}

module.exports = mapSeries;

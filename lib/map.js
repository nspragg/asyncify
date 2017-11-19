'use strict';

const fixedExecutor = require('./private/fixedExecutor');

const CONCURRENCY_LEVEL = Infinity;

async function map(iterable, fn) {
  if (!iterable) return [];
  return fixedExecutor(iterable, fn, CONCURRENCY_LEVEL);
}

module.exports = map;

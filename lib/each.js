'use strict';

const fixedExecutor = require('./private/executor');
const toArray = require('./private/toArray');
const toPartials = require('./private/toPartials');
const toAsync = require('./private/toAsync');

const CONCURRENCY_LEVEL = Infinity;

async function each(iterable, fn) {
  const asyncfn = toAsync(fn);
  const arr = toPartials(toArray(iterable), asyncfn);
  fixedExecutor(arr, CONCURRENCY_LEVEL);
}

module.exports = each;

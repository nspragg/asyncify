'use strict';

const fixedExecutor = require('./private/executor');
const toArray = require('./private/toArray');
const toPartials = require('./private/toPartials');
const toAsync = require('./private/toAsync');

module.exports = async (iterable, fn, limit) => {
  if (!iterable || limit < 1) return [];

  const asyncfn = toAsync(fn);
  const arr = toPartials(toArray(iterable), asyncfn);
  return fixedExecutor(arr, limit);
};

'use strict';

const _ = require('lodash');
const fixedExecutor = require('./private/executor');
const toArray = require('./private/toArray');

module.exports = async (iterable, fn, limit) => {
  if (!iterable || limit < 1) return [];

  let asyncfn = fn;
  if (fn.constructor.name !== 'AsyncFunction') {
    asyncfn = async (item) => {
      return fn(item);
    };
  }
  const arr = toArray(iterable).map((item) => _.partial(asyncfn, item));
  return fixedExecutor(arr, limit);
};

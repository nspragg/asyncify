'use strict';

const fixedExecutor = require('./private/fixedExecutor');

module.exports = async (iterable, fn, limit) => {
  if (!iterable || limit < 1) return [];

  let asyncfn = fn;
  if (fn.constructor.name !== 'AsyncFunction') {
    asyncfn = async (item) => {
      return fn(item);
    };
  }
  return fixedExecutor(iterable, asyncfn, limit);
};

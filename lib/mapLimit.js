'use strict';

const _ = require('lodash');
const fixedExecutor = require('./private/executor');

function toArray(iterable) {
  if (_.isPlainObject(iterable)) return Object.values(iterable);
  if (iterable instanceof Map) return Array.from(iterable.values());
  if (iterable instanceof Set) return Array.from(iterable);
  return iterable;
}

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

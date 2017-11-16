'use strict';

const getIterator = require('./getIterator');

function map(iterable, fn) {
  const pending = [];
  for (const v of iterable) {
    pending.push(fn(v));
  }
  return pending;
}

module.exports = async (iter, fn) => {
  if (!iter) return [];
  return await Promise.all(map(getIterator(iter), fn));
};

'use strict';

const toArray = require('./private/toArray');

module.exports = async (iterable, fn, initial) => {
  const arr = toArray(iterable);
  let accumulator = initial;
  for (const item of arr) {
    accumulator = await fn(accumulator, item);
  }
  return accumulator;
};

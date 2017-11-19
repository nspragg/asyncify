'use strict';

const fixedExecutor = require('./private/fixedExecutor');

module.exports = async (iterable, fn, initial) => {
  let accumulator = initial;
  await fixedExecutor(iterable, async (item) => {
    accumulator = await fn(accumulator, item);
  });
  return accumulator;
};

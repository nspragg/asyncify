const _ = require('lodash');

const getIterator = require('./getIterator');

module.exports = async(iterable, fn, initial) => {
  const iter = getIterator(iterable);
  let accumulator = !_.isUndefined(initial) ? initial : undefined;
  for (const item of iter) {
    accumulator = await fn(accumulator, item);
  }
  return accumulator;
};

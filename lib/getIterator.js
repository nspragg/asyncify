'use strict';

const _ = require('lodash');

function toIter(object) {
  object[Symbol.iterator] = () => {
    const values = Object.keys(object);
    let i = 0;
    return {
      next: () => {
        return {
          value: object[values[i++]],
          done: i > values.length
        };
      }
    };
  };
  return object;
}

module.exports = (iterable) => {
  if (_.isPlainObject(iterable)) return toIter(iterable);
  if (iterable instanceof Map) return iterable.values();
  return iterable;
};

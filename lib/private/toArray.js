'use strict';

const _ = require('lodash');

function toArray(iterable) {
  if (_.isPlainObject(iterable)) return Object.values(iterable);
  if (iterable instanceof Map) return Array.from(iterable.values());
  if (iterable instanceof Set) return Array.from(iterable);
  return iterable;
}

module.exports = toArray;

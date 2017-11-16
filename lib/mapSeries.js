'use strict';

const _ = require('lodash');

function map(iterable, fn) {
  const pending = [];
  for (const v of iterable) {
    pending.push(fn(v));
  }
  return pending;
}

module.exports = async (iter, fn) => {
  return await Promise.all(map(iter, fn));
};

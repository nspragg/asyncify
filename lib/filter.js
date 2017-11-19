'use strict';

const _ = require('lodash');
const executor = require('./private/executor');

module.exports = async (arr, fn) => {
  arr = arr.map((item) =>
    _.partial(async (item) => {
      if (await fn(item)) return item;
    }, item)
  );
  return _.compact(await executor(arr));
};

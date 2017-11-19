'use strict';

const fixedExecutor = require('./private/executor');

module.exports = async (iterable) => {
  return fixedExecutor(iterable);
};

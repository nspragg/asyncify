'use strict';

const fixedExecutor = require('./private/fixedExecutor');

module.exports = async (iter, fn) => {
  const results = await fixedExecutor(iter, async (item) => {
    const value = await fn(item);
    if (value) {
      return item;
    }
  });
  return results.filter((v) => v !== undefined);
};

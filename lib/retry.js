'use strict';

const delay = require('./delay');

const DEFAULT_DELAY = 100;

module.exports = async (fn, retries, interval) => {
  interval = interval === undefined ? DEFAULT_DELAY : interval;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      await delay(interval);
      if (i === retries - 1) {
        throw err;
      }
    }
  }
};

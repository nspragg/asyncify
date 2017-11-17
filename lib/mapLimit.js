'use strict';

const ExecutorError = require('./private/ExecutorError');

async function fixedExecutor(iter, task, limit = 1) {
  const results = [];
  let active = 0;

  return new Promise((resolve, reject) => {
    function executeTask() {
      while (active < limit && iter.length > 0) {
        active++;
        const next = iter.shift();
        task(next)
          .then((result) => {
            results.push(result);

            if (--active <= 0 && iter.length === 0) return resolve(results);
            if (iter.length > 0) {
              executeTask();
            }
          })
          .catch((e) => {
            // TODO - different policies for handling errors
            return reject(new ExecutorError(e.message));
          });
      }
    }
    executeTask();
  });
}

module.exports = async (iterable, fn, limit) => {
  if (!iterable || limit < 1) return [];

  let asyncfn = fn;
  if (fn.constructor.name !== 'AsyncFunction') {
    asyncfn = async (item) => {
      return fn(item);
    };
  }
  return fixedExecutor(iterable, asyncfn, limit);
};

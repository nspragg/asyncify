'use strict';

const ExecutorError = require('./ExecutorError');

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
            return reject(new ExecutorError(e.message));
          });
      }
    }
    executeTask();
  });
}

module.exports = fixedExecutor;

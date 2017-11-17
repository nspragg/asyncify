'use strict';

const ExecutorError = require('./ExecutorError');

async function fixedExecutor(task, limit = 1) {
  let completed = false;
  let active = 0;

  return new Promise((resolve, reject) => {
    function executeTask() {
      while (active < limit && !completed) {
        active++;
        task()
          .then((hasNext) => {
            if (--active <= 0 && (completed || !hasNext)) return resolve();
            if (hasNext) {
              executeTask();
            } else {
              completed = true;
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

async function mapLimit(iterable, fn, limit) {
  if (!iterable || limit < 1) return [];

  const results = [];
  let i = 0;
  await fixedExecutor(async () => {
    if (i < iterable.length) {
      const value = iterable[i++];
      results.push(await fn(value));
    }
    return i < iterable.length;
  }, limit);

  return results;
}

module.exports = async (iter, fn, limit) => {
  return mapLimit(iter, fn, limit);
};
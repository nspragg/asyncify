'use strict';

const _ = require('lodash');
const ExecutorError = require('./ExecutorError');

function normalise(iterable) {
  if (_.isPlainObject(iterable)) return Object.values(iterable);
  if (iterable instanceof Map) return Array.from(iterable.values());
  if (iterable instanceof Set) return Array.from(iterable);
  return iterable;
}

async function fixedExecutor(arr, task, limit = 1) {
  if (!Array.isArray(arr)) throw new TypeError(`Expecting array but got ${typeof arr}`);

  const results = [];
  let active = 0;

  return new Promise((resolve, reject) => {
    function executeTask() {
      while (active < limit && arr.length > 0) {
        active++;
        task(arr.shift())
          .then((result) => {
            results.push(result);
            if (--active <= 0 && arr.length === 0) {
              return resolve(results);
            }
            executeTask();
          })
          .catch((e) => {
            return reject(new ExecutorError(e.message));
          });
      }
    }
    executeTask();
  });
}

module.exports = async (iterable, task, limit) => {
  return fixedExecutor(normalise(iterable), task, limit);
};

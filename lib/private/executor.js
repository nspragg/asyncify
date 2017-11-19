'use strict';

const _ = require('lodash');
const ExecutorError = require('./ExecutorError');

const CONCURRENCY_LEVEL = Infinity;

class ArrayHandler {
  constructor() {
    this.results = [];
  }

  exec(fn) {
    return fn().then((result) => {
      this.results.push(result);
      return result;
    });
  }
}

class ObjectHandler {
  constructor() {
    this.results = {};
  }

  exec(task) {
    const [k, fn] = task;
    return fn().then((result) => {
      this.results[k] = result;
      return result;
    });
  }
}

async function parallelExecutor(arr, handler, limit = CONCURRENCY_LEVEL) {
  if (!Array.isArray(arr)) throw new TypeError(`Expecting array but got ${typeof arr}`);

  let active = 0;
  return new Promise((resolve, reject) => {
    function executeTask() {
      while (active < limit && arr.length > 0) {
        active++;
        const pending = handler.exec(arr.shift());
        pending
          .then(() => {
            if (--active <= 0 && arr.length === 0) return resolve(handler.results);
            executeTask();
          })
          .catch((e) => reject(new ExecutorError(e.message)));
      }
    }
    executeTask();
  });
}

async function handleObject(obj, limit) {
  const arr = [];
  for (const k of Object.keys(obj)) {
    arr.push([k, obj[k]]);
  }
  return parallelExecutor(arr, new ObjectHandler(), limit);
}

async function handleArray(arr, limit) {
  if (!arr) return [];
  return parallelExecutor(arr, new ArrayHandler(), limit);
}

module.exports = async (iterable, limit) => {
  if (_.isPlainObject(iterable)) return handleObject(iterable, limit);
  return handleArray(iterable, limit);
};

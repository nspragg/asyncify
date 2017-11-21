'use strict';

function toAsync(fn) {
  if (fn.constructor.name !== 'AsyncFunction') {
    return async (item) => {
      return fn(item);
    };
  }
  return fn;
}

module.exports = toAsync;

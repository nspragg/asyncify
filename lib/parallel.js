'use strict';

const _ = require('lodash');

async function toReturnValues(pending) {
  for (const [k, v] of Object.entries(pending)) {
    pending[k] = await v;
  }
  return pending;
}

async function handleObject(obj) {
  const pending = {};
  for (const k of Object.keys(obj)) {
    pending[k] = obj[k]();
  }
  await Promise.all(Object.values(pending));

  return toReturnValues(pending);
}

async function handleArray(arr) {
  const pending = [];
  for (const task of arr) {
    pending.push(task());
  }
  return await Promise.all(pending);
}

module.exports = async iter => {
  if (_.isPlainObject(iter)) return handleObject(iter);
  return handleArray(iter);
};

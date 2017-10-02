'use strict';

const _ = require('lodash');

function from(_arguments) {
  if (_.isArray(_arguments[0])) return _arguments[0];

  return Array.prototype.slice.call(_arguments);
}

module.exports = async(arr) => {
  let result = await arr[0]();
  for (let i = 1; i < arr.length; ++i) {
    result = await arr[i](result);
  }
  return result;
};

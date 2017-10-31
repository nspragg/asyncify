'use strict';

const _ = require('lodash');

module.exports = async(...args) => {
  args = _.flatten(args);

  let result = await args[0]();
  for (let i = 1; i < args.length; ++i) {
    result = await args[i](result);
  }
  return result;
};

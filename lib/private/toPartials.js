'use strict';

const _ = require('lodash');

function toPartials(iterable, asyncfn) {
  return iterable.map((item) => _.partial(asyncfn, item));
}

module.exports = toPartials;

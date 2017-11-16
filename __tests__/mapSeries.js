'use strict';

const asyncify = require('../lib/asyncify');
const double = require('./utils/functions');

describe('.mapSeries', () => {
  it('map each element', async () => {
    const results = await asyncify.mapSeries([10, 20, 30], double);
    expect(results).toEqual([20, 40, 60]);
  });
});

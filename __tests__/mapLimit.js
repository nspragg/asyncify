'use strict';

const asyncify = require('../lib/asyncify');
const double = require('./utils/functions');

describe('.mapLimit', () => {
  it('map each element', async () => {
    const results = await asyncify.mapLimit([10, 20, 30], double, 2);
    expect(results).toEqual([20, 40, 60]);
  });

  it('returns an empty array when iter is undefined', async () => {
    const results = await asyncify.mapLimit(undefined, double, 2);
    expect(results).toEqual([]);
  });

  it('limit zero', async () => {
    const results = await asyncify.mapLimit(
      [10, 20, 30],
      async () => {
        throw new Error('fn was called unexpectedly');
      },
      0
    );
    expect(results).toEqual([]);
  });

  it('limit in progress', async () => {
    const limit = 2;
    const running = [];

    const results = await asyncify.mapLimit(
      [10, 20, 30, 40, 50, 60],
      async number => {
        running.push(number);

        const active = running.length;
        if (active > 1) {
          expect(active).toBeLessThanOrEqual(limit);
        }
        return double(number).then(doubled => {
          running.pop();
          return doubled;
        });
      },
      limit
    );

    expect(results).toEqual([20, 40, 60, 80, 100, 120]);
  });

  it('limit <');
  it('limit >');
  it('error');
  it('map');
  it('set');
});

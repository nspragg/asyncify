'use strict';

const asyncify = require('../lib/asyncify');

async function double(n) {
  return n << 1;
}

function createTask(name, arr, timeout) {
  return async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        arr.push(name);
        resolve(`done->${name}`);
      }, timeout);
    });
  };
}

describe('asyncify', () => {
  describe('.waterfall', async () => {
    it('executes an array of async functions asynchronously', async () => {
      const results = await asyncify.waterfall([double.bind(null, 10), double, double]);
      expect(results).toBe(80);
    });

    it('supports var args', async () => {
      const results = await asyncify.waterfall(double.bind(null, 10), double, double);
      expect(results).toBe(80);
    });
  });

  describe('.map', async () => {
    it('map each element', async () => {
      const results = await asyncify.map([10, 20, 30], double);
      expect(results).toEqual([20, 40, 60]);
    });

    it('does not mutable input', async () => {
      const input = [10, 20, 30];
      const results = await asyncify.map(input, double);
      expect(input).toEqual(input);
    });

    it('returns an empty array when the input is undefined', async () => {
      const results = await asyncify.map(undefined, double);
      expect(results).toEqual([]);
    });

    it('map of element of an Object', async () => {
      const obj = {
        a: 10,
        b: 20,
        c: 30
      };
      const results = await asyncify.map(obj, double);
      expect(results).toEqual([20, 40, 60]);
    });

    it('map of element of an Map', async () => {
      const map = new Map([['a', 10], ['b', 20], ['c', 30]]);
      const results = await asyncify.map(map, double);

      expect(results).toEqual([20, 40, 60]);
    });

    it('map of element of an Set', async () => {
      const set = new Set([10, 20, 30]);
      const results = await asyncify.map(set, double);

      expect(results).toEqual([20, 40, 60]);
    });
  });

  describe('.mapSeries', () => {
    it('map each element', async () => {
      const results = await asyncify.mapSeries([10, 20, 30], double);
      expect(results).toEqual([20, 40, 60]);
    });
  });

  describe('.mapLimit', () => {
    it('map each element', async () => {
      const results = await asyncify.mapLimit([10, 20, 30], 2, double);
      expect(results).toEqual([20, 40, 60]);
    });

    it('returns an empty array when iter is undefined', async () => {
      const results = await asyncify.mapLimit(undefined, 2, double);
      expect(results).toEqual([]);
    });

    it('limit zero', async () => {
      const results = await asyncify.mapLimit([10, 20, 30], 0, async () => {
        throw new Error('fn was called unexpectedly');
      });
      expect(results).toEqual([]);
    });

    it('limit in progress', async () => {
      const limit = 2;
      let called = 0;
      const running = [];
      const results = await asyncify.mapLimit([10, 20, 30, 40, 50, 60], limit, async n => {
        running.push(n);
        called++;
        const active = running.length;
        if (active > 1) {
          expect(active).toBeLessThanOrEqual(limit);
        }
        return double(n).then(x => {
          running.pop();
          return x;
        });
      });
      expect(results).toEqual([20, 40, 60, 80, 100, 120]);
      expect(called).toBeLessThanOrEqual(6);
    });

    it('limit <');
    it('limit >');
    it('error');
    it('map');
    it('set');
  });

  describe('.reduce', () => {
    async function sum(acc, value) {
      return acc + value;
    }

    it('applies a given fn to each element of the array and an accumulator', async () => {
      const results = await asyncify.reduce([10, 20, 30], sum, 0);
      expect(results).toBe(60);
    });

    it('can reduce other iterable objects', async () => {
      const iterable = new Map([['a', 10], ['b', 20], ['c', 30]]);
      const results = await asyncify.reduce(iterable, sum, 0);
      expect(results).toBe(60);
    });

    it('reduces an object', async () => {
      const obj = {
        a: 10,
        b: 20,
        c: 30
      };
      const results = await asyncify.reduce(obj, sum, 0);
      expect(results).toBe(60);
    });
  });

  describe('.parallel', () => {
    it('executes an array of async functions in parallel', async () => {
      const order = [];
      await asyncify.parallel([createTask('a', order, 100), createTask('b', order, 250), createTask('c', order, 20)]);
      expect(order).toEqual(['c', 'a', 'b']);
    });

    it('executes an object of async functions in parallel', async () => {
      const order = [];
      const results = await asyncify.parallel({
        a: createTask('a', order, 100),
        b: createTask('b', order, 250),
        c: createTask('c', order, 20)
      });

      expect(order).toEqual(['c', 'a', 'b']);
      expect(results).toEqual({
        a: 'done->a',
        b: 'done->b',
        c: 'done->c'
      });
    });
  });

  describe('.filter', () => {
    function lessThan(n) {
      return async value => {
        return value < n;
      };
    }
    it('filters an array given a predicate', async () => {
      const arr = [10, 20, 50, 100, 200];
      const results = await asyncify.filter(arr, lessThan(50));
      expect(results).toEqual([10, 20]);
    });
  });

  describe('.each', () => {});

  describe('.delayedResolve', () => {});

  describe('.delayedReject', () => {});

  describe('.successful', () => {
    it('returns an array of successfully executions', async () => {
      const results = await asyncify.successful([Promise.resolve('a'), Promise.resolve('b'), Promise.resolve('c')]);

      expect(results[0]).toBe('a');
      expect(results[1]).toBe('b');
      expect(results[2]).toBe('c');
    });

    it('returns errors in place of failures', async () => {
      const results = await asyncify.successful([
        Promise.resolve('a'),
        Promise.reject(new Error('b failed')),
        Promise.resolve('c'),
        Promise.reject(new Error('d failed'))
      ]);

      expect(results[0]).toBe('a');
      expect(results[1].message).toBe('b failed');
      expect(results[2]).toBe('c');
      expect(results[3].message).toBe('d failed');
    });
  });
});

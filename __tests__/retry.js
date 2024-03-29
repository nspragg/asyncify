'use strict';

const asyncify = require('../lib/asyncify');

function retrySequence(resolveOnCall) {
  let i = 0;
  return () => {
    if (++i >= resolveOnCall) {
      return Promise.resolve(`returned on the ${i}th time.`);
    }
    return Promise.reject(new Error(`Failed for the ${i}th time.`));
  };
}

describe('retry', () => {
  it('retries n times', async () => {
    const times = 2;
    const fn = retrySequence(times);
    const ans = await asyncify.retry(fn, times);
    expect(ans).toBe(`returned on the ${times}th time.`);
  });

  it('applies a delay between retries', async () => {
    const times = 2;
    const epsilon = 15;
    const fn = retrySequence(times);

    const start = new Date();
    await asyncify.retry(fn, times);
    const time = new Date() - start;

    expect(time).toBeGreaterThanOrEqual(100 * (times - 1));
    expect(time).toBeLessThanOrEqual(100 * (times - 1) + epsilon);
  });

  it('returns an error when retries exceeded', async () => {
    const times = 2;
    const fn = retrySequence(times + 1);
    try {
      await asyncify.retry(fn, times);
    } catch (err) {
      return expect(err.message).toBe(`Failed for the ${times}th time.`);
    }
  });
});

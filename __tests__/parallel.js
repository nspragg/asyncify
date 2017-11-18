'use strict';

const asyncify = require('../lib/asyncify');

function createTask(name, arr, timeout) {
  return async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        arr.push(name);
        resolve(`done->${name}`);
      }, timeout);
    });
  };
}
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

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
    const callOrder = [];
    const results = await asyncify.parallel([
      createTask('a', callOrder, 100),
      createTask('b', callOrder, 250),
      createTask('c', callOrder, 20)
    ]);
    expect(callOrder).toEqual(['c', 'a', 'b']);
    expect(results).toEqual(['done->c', 'done->a', 'done->b']);
  });

  it('executes an object of async functions in parallel', async () => {
    const callOrder = [];
    const results = await asyncify.parallel({
      a: createTask('a', callOrder, 100),
      b: createTask('b', callOrder, 250),
      c: createTask('c', callOrder, 20)
    });

    expect(callOrder).toEqual(['c', 'a', 'b']);
    expect(results).toEqual({
      a: 'done->a',
      b: 'done->b',
      c: 'done->c'
    });
  });
});

# Asyncify

Async util functions

## Installation

```
npm install --save asyncify
```

## Usage

```js
const asyncify = require('async-utils');

async function double(n) {
  return n << 1;
}

const results = await asyncify.mapSeries([10, 20, 30], double);
console.log(results); // [20, 30, 60]
```

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```

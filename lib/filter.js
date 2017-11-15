'use strict';

module.exports = async (iter, fn) => {
  const filtered = [];
  for (const item of iter) {
    const rtn = await fn(item);
    if (rtn) {
      filtered.push(item);
    }
  }
  return filtered;
};

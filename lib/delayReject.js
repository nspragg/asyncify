'use strict';

module.exports = async (delayMs, err) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(err);
    }, delayMs);
  });
};

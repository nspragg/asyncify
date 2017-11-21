'use strict';

module.exports = async (delayMs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
};

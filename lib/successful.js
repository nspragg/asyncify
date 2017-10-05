module.exports = async(arr, fn) => {
  const successful = [];
  for (const [index, pending] of arr.entries()) {
    try {
      successful[index] = await pending;
    } catch (err) {
      successful[index] = err;
    }
  }

  return successful;
};

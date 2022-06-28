const getTimeout = (callback) => {
  let timeout = null;
  const delay = 5000;

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const start = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback();
      start();
    }, delay);
  };

  return { start, stop };
};

export default getTimeout;

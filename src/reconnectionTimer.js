const getTimeout = (callback) => {
  let timeout = null;

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
    }, 5000);
  };

  return { start, stop };
};

export default getTimeout;

export default () => {
  // eslint-disable-next-line no-unused-vars
  const state = {
    activeLink: null,
    urlInput: 'blank',
    feeds: [],
    errors: {
      formatErrors: 0,
      repeatErrors: 0,
    },
  };

  return state;
};

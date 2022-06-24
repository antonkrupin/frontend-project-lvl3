/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';

import parserXML from './parser';

const handler = (event, state) => {
  event.preventDefault();

  state.formStatus = 'processing';

  const formData = new FormData(event.target);
  const link = formData.get('url').trim();

  const rssValidateSchema = yup.object().shape({
    link: yup.string().url().notOneOf(state.feeds),
  });

  const validateRss = (fields) => {
    try {
      return rssValidateSchema.validate(fields).then((e) => e);
    } catch (e) {
      return e;
    }
  };

  validateRss({ link }).then(() => {
    state.networkError = false;
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;

    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const data = response.data.contents;
      parserXML(data);
      state.feeds.push(link);
      state.formStatus = 'processed';
    }).catch(() => {
      state.networkError = true;
      state.formStatus = 'failure';
    });
  }).catch((error) => {
    state.errorValue = error.errors;
    state.formStatus = 'failure';
  });
};

export default handler;

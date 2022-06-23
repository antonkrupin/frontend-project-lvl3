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
    // test link, don`t forget remove after end project;
    const testLink = 'http://lorem-rss.herokuapp.com/feed';
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${testLink}`;
    state.errorValue = 'Rss добавлен';
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const data = response.data.contents;
      parserXML(data);
      state.feeds.push(link);
      state.formStatus = 'processed';
    }).catch((axiosError) => {
      state.errorValue = axiosError;
      state.formStatus = 'failure';
    });
  }).catch((error) => {
    state.errorValue = error.errors;
    state.formStatus = 'failure';
  });
};

export default handler;

import * as yup from 'yup';
import axios from 'axios';

import parserXML from './parser';

const handler = (event, state) => {
  event.preventDefault();
  // eslint-disable-next-line no-param-reassign
  state.formStatus = 'processing';
  const formData = new FormData(event.target);
  const link = formData.get('url').trim();

  const rssValidateSchema = yup.object().shape({
    // разобраться с работой notOneOf
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

    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const data = response.data.contents;
      parserXML(data);
      // eslint-disable-next-line no-param-reassign
      state.feeds.push(link);
      // eslint-disable-next-line no-param-reassign
      state.formStatus = 'processed';
    }).catch((axiosError) => {
      // eslint-disable-next-line no-param-reassign
      state.errorValue = axiosError;
      // eslint-disable-next-line no-param-reassign
      state.formStatus = 'failure';
    });
  }).catch((error) => {
    // eslint-disable-next-line no-param-reassign
    state.formStatus = 'failure';
    console.log(error.name);
    console.log(error.errors);
  });
};

export default handler;

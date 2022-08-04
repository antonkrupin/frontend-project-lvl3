/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

import parserXML from './parser';
import { updateFeeds } from './renders';

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
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const data = response.data.contents;
      state.feedsObjects.push(parserXML(data, link));
      console.log(state);
      state.feeds.push(link);
      state.formStatus = 'processed';
    }).catch((error) => {
      if (error.name === 'AxiosError') {
        state.formStatus = 'networkFailure';
      } else {
        state.errorValue = error.name;
        state.formStatus = 'failure';
      }
    });
  }).catch((error) => {
    [state.errorValue] = error.errors;
    state.formStatus = 'failure';
  });
};

export const updateRss = (state) => {
  state.feeds.forEach((link) => {
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => parserXML(response.data.contents).posts)
      .then((posts) => {
        state.feedsObjects.forEach((elem) => {
          if (elem.rssLink === link) {
            const keys = posts.map((post) => _.keys(post));
            console.log(keys);
            console.log(posts);
            elem.posts = posts;
            updateFeeds(state.feedsObjects);
          }
        });
      });
  });

  setTimeout(() => updateRss(state), 5000);
};

export default handler;

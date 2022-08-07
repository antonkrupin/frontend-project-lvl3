/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
// import _ from 'lodash';

import parserXML from './parser';
import { updateFeeds } from './renders';

const handler = (event, state) => {
  event.preventDefault();

  state.formStatus = 'processing';

  const formData = new FormData(event.target);

  const link = formData.get('url').trim();
  console.log('this is link');
  console.log(link);

  const rssValidateSchema = yup.object().shape({
    link: yup.string().url().notOneOf(state.rssLinks),
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
      const { feed, posts } = parserXML(response.data.contents, link);
      state.posts.push(posts);
      state.feeds.push(feed);
      state.rssLinks.push(feed.rssLink);
      console.log(state.rawFeeds);
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
            // const keys = posts.map((post) => _.keys(post));
            elem.posts = posts;
            updateFeeds(state.feedsObjects);
          }
        });
      });
  });

  setTimeout(() => updateRss(state), 5000);
};

export default handler;

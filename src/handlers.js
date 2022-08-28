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
    // state.networkError = false;
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const { feed, posts } = parserXML(response.data.contents, link);
      state.posts.push(posts);
      state.feeds.push(feed);
      state.rssLinks.push(feed.rssLink);
      state.formStatus = 'processed';
    }).catch((error) => {
      /* if (error.name === 'AxiosError') {
        // state.formStatus = 'networkFailure';
        // добавил
        state.errorValue = 'AxiosError';
      } else {
        state.errorValue = error.name;
        // state.formStatus = 'failure';
      } */
      state.errorValue = error.name === 'AxiosError' ? 'AxiosError' : error.name;
    });
  }).catch((error) => {
    [state.errorValue] = error.errors;
    // state.formStatus = 'failure';
  });
};
// test comment

export const updateRss = (state) => {
  state.rssLinks.forEach((link) => {
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => parserXML(response.data.contents, link))
      .then((data) => {
        const { id, posts } = data;
        state.feeds.forEach((feed) => {
          if (feed.rssLink === link) {
            const updatedFeedId = feed.id;
            // eslint-disable-next-line max-len
            const newPosts = posts[id];
            const oldPosts = state.posts.filter((post) => post[updatedFeedId])[0][updatedFeedId];
            const difference = _.differenceBy(newPosts, oldPosts, 'postDate');
            if (difference.length !== 0) {
              oldPosts.unshift(difference[0]);
              state.posts.forEach((post) => {
                if (post[updatedFeedId]) {
                  updateFeeds(post[updatedFeedId]);
                }
              });
            }
          }
        });
      });
  });

  setTimeout(() => updateRss(state), 5000);
};

export default handler;

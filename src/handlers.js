/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

import parserXML from './parser';
import { updateFeeds } from './renders';

const validateRss = (state, url) => {
  const rssValidateSchema = yup.object().shape({
    link: yup.string().url().notOneOf(state.rssLinks),
  });

  return rssValidateSchema.validate(url).catch((error) => {
    throw error;
  });
};

const downloadRss = (rssUrl) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return axios
    .get(rssLink)
    .then((response) => [response.data.contents, rssUrl])
    .catch((error) => {
      throw error;
    });
};

const downloadRss1 = (rssUrl) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return axios
    .get(rssLink)
    .then((response) => [response.data.contents])
    .catch((error) => {
      throw error;
    });
};

const handler = (event, state) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const link = formData.get('url').trim();

  event.target.querySelector('fieldset').setAttribute('disabled', 'disabled');

  validateRss(state, { link })
    .then(() => {
      state.formStatus = 'processing';
      return downloadRss(link);
    })
    .then((response) => {
      const id = _.uniqueId();
      const { feed, posts } = parserXML(response, link);
      feed.id = id;
      state.posts.push({ [id]: posts });
      state.feeds.push(feed);
      state.rssLinks.push(feed.rssLink);
      state.formStatus = 'processed';
    })
    .catch((error) => {
      switch (error.name) {
        case 'AxiosError': {
          state.errorValue = 'AxiosError';
          break;
        }
        case 'TypeError': {
          state.errorValue = error.name;
          break;
        }
        case 'ValidationError': {
          state.errorValue = error.message;
          break;
        }
        default:
          throw new Error('Unexpected error type');
      }
    });
};

export const updateRss = (state) => {
  const promises = state.rssLinks.map((link) => downloadRss1(link).then((response) => {
    const { posts } = parserXML(response, link);
    state.feeds.forEach((feed) => {
      if (feed.rssLink === link) {
        const updatedFeedId = feed.id;
        const newPosts = posts;
        // eslint-disable-next-line max-len
        const oldPosts = state.posts.filter((post) => updatedFeedId in post ?? post[updatedFeedId])[0][updatedFeedId];
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
  }).catch((error) => state.errorValue = error.name));
  Promise.all(promises).then(() => setTimeout(() => updateRss(state), 5000));
};

export const updateRss1 = (state) => {
  const promises = state.rssLinks.map((link) => downloadRss(link));
  Promise.all(promises).then((response) => {
    response.forEach((el) => {
      const { posts } = parserXML(el[0], el[1]);
      state.feeds.forEach((feed) => {
        if (feed.rssLink === el[1]) {
          const updatedFeedId = feed.id;
          const newPosts = posts;
          // eslint-disable-next-line max-len
          const oldPosts = state.posts.filter((post) => updatedFeedId in post ?? post[updatedFeedId])[0][updatedFeedId];
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
  }).then(() => {
    setTimeout(() => updateRss1(state), 5000);
  });
};

export default handler;

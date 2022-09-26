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

  return rssValidateSchema.validate(url);
};

const downloadRss = (rssUrl) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return axios
    .get(rssLink)
    .then((response) => [response.data.contents]);
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
      // state.posts.push({ [id]: posts });
      posts.forEach((post) => {
        state.posts.push({ id, post });
      });
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
  const promises = state.rssLinks.map((link) => downloadRss(link).then((response) => {
    const { posts } = parserXML(response, link);
    state.feeds.forEach((feed) => {
      if (feed.rssLink === link) {
        const { id } = feed;
        // const updatedPosts = posts.map((post) => ({ id, post }));
        // const updateTest = updatedPosts.map((post) => post.post);
        // const oldPosts = state.posts.filter((post) => post.id === id);
        // const oldTest = oldPosts.map((post) => post.post);
        const oldPosts = state.posts.filter((post) => post.id === id).map((post) => post.post);
        // console.log(oldPosts1);
        const difference = _.differenceBy(posts, oldPosts, 'postDate');
        if (difference.length !== 0) {
          state.posts.unshift({ id, post: difference[0] });
          state.posts.forEach((post) => {
            updateFeeds(post);
          });
        }
      }
      /* if (feed.rssLink === link) {
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
      } */
    });
  }).catch((error) => { state.errorValue = error.name; }));
  Promise.all(promises).then(() => setTimeout(() => updateRss(state), 5000));
};

export default handler;

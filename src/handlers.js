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
    console.log(error.type);
    throw error;
  });
};

/* const downloadRss = (rssUrl) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return axios
    .get(rssLink)
    .then((response) => response.data.contents)
    .catch((error) => {
      throw error;
    });
}; */

const handler = (event, state) => {
  event.preventDefault();

  state.formStatus = 'processing';

  const formData = new FormData(event.target);

  const link = formData.get('url').trim();

  event.target.querySelector('fieldset').setAttribute('disabled', 'disabled');

  /* validateRss(state, { link })
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
      console.log(error);
    }); */

  validateRss(state, { link }).then(() => {
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const id = _.uniqueId();
      const { feed, posts } = parserXML(response.data.contents, link);
      feed.id = id;
      state.posts.push({ [id]: posts });
      state.feeds.push(feed);
      state.rssLinks.push(feed.rssLink);
      state.formStatus = 'processed';
    }).catch((error) => {
      state.errorValue = error.name === 'AxiosError' ? 'AxiosError' : error.name;
    });
  }).catch((error) => {
    [state.errorValue] = error.errors;
  });
};

export const updateRss = (state) => {
  state.rssLinks.forEach((link) => {
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => {
      const { posts } = parserXML(response.data.contents, link);
      state.feeds.forEach((feed) => {
        if (feed.rssLink === link) {
          const updatedFeedId = feed.id;
          const newPosts = posts;
          const oldPosts = state.posts.map((post) => post[updatedFeedId])[0];
          const difference = _.differenceBy(newPosts, oldPosts, 'postDate');
          // console.log(difference);
          // console.log(difference[0]);
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
    }).catch((error) => { state.errorValue = error.name === 'AxiosError' ? 'AxiosError' : error.name; });
  });

  setTimeout(() => updateRss(state), 5000);
};

export default handler;

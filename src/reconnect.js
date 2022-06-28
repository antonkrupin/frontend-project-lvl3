/* eslint-disable no-param-reassign */
import axios from 'axios';

import parserXML from './parser.js';
import renderFeeds from './renders.js';

export default (state, link) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;

  axios({
    method: 'get',
    url: rssLink,
  }).then((response) => {
    const data = response.data.contents;
    const test = parserXML(data);
    state.feedsObjects.forEach((el) => {
      if (el.rssLink === link) {
        el.items = test.items;
        //renderPost(state.feedsObjects);
        renderFeeds(state.feedsObjects);
        //newRenderFeeds(state.feedsObjects);
      }
    });
  });
};

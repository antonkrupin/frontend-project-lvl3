/* eslint-disable no-param-reassign */
import axios from 'axios';

import parserXML from './parser';

export default (state, link) => {
  const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;

  axios({
    method: 'get',
    url: rssLink,
  }).then((response) => {
    const data = response.data.contents;
    const test = parserXML(data);
    state.feedsObjects.forEach((el) => {
      console.log(el.items);
    });
    console.log('новое');
    console.log(test);
  });
};

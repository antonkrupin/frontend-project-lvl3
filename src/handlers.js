/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

import parserXML from './parser';
import renderFeeds, { updateFeeds } from './renders';

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
      console.log(parserXML(data, link));
      console.log(state);
      state.feeds.push(link);
      state.formStatus = 'processed';
    }).catch(() => {
      state.networkError = true;
      state.formStatus = 'failure';
    });
  }).catch((error) => {
    state.errorValue = error.errors;
    state.formStatus = 'failure';
  });
};

export const buttonHandler = (button) => {
  const modal = document.querySelector('#exampleModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const readButton = modal.querySelector('.modal-footer a');

  const closest = button.closest('.post');
  const link = closest.querySelector('a');

  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');

  modalTitle.textContent = link.textContent;
  modalBody.textContent = link.getAttribute('data-description');

  readButton.setAttribute('href', link.getAttribute('href'));
};

export const updateRss = (state) => {
  Promise.all(state.feeds.map((link) => {
    const rssLink = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    axios({
      method: 'get',
      url: rssLink,
    }).then((response) => parserXML(response.data.contents).items)
      .then((posts) => {
        state.feedsObjects.map((elem) => {
          if (elem.rssLink === link) {
            elem.items = posts;
            //renderFeeds(state.feedsObjects);
            updateFeeds(state.feedsObjects);
          }
        });
      });
  }));

  setTimeout(() => updateRss(state), 5000);
};

export default handler;

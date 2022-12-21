import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { formStatusHandler, updateRss, handlePostClick } from './controller';
import {
  errorsRender, renderModal, renderPosts, renderFeeds,
} from './view';

const app = () => {
  const state = {
    rssLinks: [],
    feeds: [],
    posts: [],
    errorValue: '',
    formStatus: 'filling',
    ui: {
      clickedLink: null,
      viewedPostLinks: new Set(),
    },
  };

  const inputField = document.querySelector('#url-input');
  const feedBackField = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const fieldset = form.querySelector('fieldset');
  const postsContainer = document.querySelector('.posts');
  const feedsContainer = document.querySelector('.feeds');

  const elements = {
    form,
    inputField,
    feedBackField,
    fieldset,
    postsContainer,
    feedsContainer,
  };

  const i18Instance = i18next.createInstance();

  i18Instance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    yup.setLocale({
      string: {
        url: 'notValidUrlFormat',
      },
      mixed: {
        notOneOf: 'rssRepeat',
      },
    });

    const watchedState = onChange(state, (path, value) => {
      console.log('path', path);
      console.log(value);
      switch (path) {
        case 'feeds': {
          renderFeeds(state, elements, i18Instance);
          break;
        }
        case 'formStatus':
          formStatusHandler(
            state,
            elements,
            i18Instance,
          );
          break;
        case 'errorValue':
          errorsRender(
            elements,
            i18Instance.t(value),
          );
          break;
        case 'ui.viewedPostLinks':
          renderPosts(state);
          break;
        case 'ui.clickedLink':
          renderModal(state);
          break;
        default:
          break;
      }
    });

    form.addEventListener('submit', (e) => {
      handler(e, watchedState);
    });

    postsContainer.addEventListener('click', (e) => {
      handlePostClick(e.target, watchedState);
    });

    updateRss(state);
  });
};

export default app;

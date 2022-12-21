import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { formStatusHandler, updateRss, test } from './controller';
import { errorsRender } from './view';

const app = () => {
  const state = {
    rssLinks: [],
    feeds: [],
    posts: [],
    errorValue: '',
    formStatus: 'filling',
    modal: {
      postLink: '',
    },
  };

  const inputField = document.querySelector('#url-input');
  const feedBackField = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const fieldset = form.querySelector('fieldset');
  const postsArea = document.querySelector('.posts');

  const formElements = {
    form,
    inputField,
    feedBackField,
    fieldset,
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
      console.log(path);
      switch (path) {
        case 'formStatus':
          formStatusHandler(
            state,
            formElements,
            i18Instance,
          );
          break;
        case 'errorValue':
          errorsRender(
            formElements,
            i18Instance.t(value),
          );
          break;
        default:
          break;
      }
    });

    form.addEventListener('submit', (e) => {
      handler(e, watchedState);
    });

    postsArea.addEventListener('click', (e) => {
      test(e, watchedState);
    });

    updateRss(state);
  });
};

export default app;

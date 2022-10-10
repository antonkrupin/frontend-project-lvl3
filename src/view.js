import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { formStatusHandler, updateRss } from './handlers';
import { errorsRender } from './renders';

const app = () => {
  const state = {
    rssLinks: [],
    feeds: [],
    posts: [],
    errorValue: '',
    formStatus: 'filling',
  };

  const inputField = document.querySelector('#url-input');
  const feedBackField = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const fieldset = form.querySelector('fieldset');

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
      switch (path) {
        case 'formStatus':
          formStatusHandler(
            state,
            value,
            form,
            inputField,
            feedBackField,
            fieldset,
            i18Instance,
          );
          break;
        case 'errorValue':
          errorsRender(
            inputField,
            feedBackField,
            fieldset,
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

    updateRss(state);
  });
};

export default app;

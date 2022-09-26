import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { updateRss } from './handlers';
import renderAll, { formErrorRender } from './renders';

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

    const formStatusHandler = (status) => {
      switch (status) {
        case 'processing':
          feedBackField.classList.add('text-success');
          feedBackField.classList.remove('text-danger');
          feedBackField.textContent = i18Instance.t('watching');
          break;
        case 'processed':
          fieldset.removeAttribute('disabled', 'disabled');
          inputField.classList.add('is-valid');
          inputField.classList.remove('is-invalid');
          feedBackField.classList.add('text-success');
          feedBackField.classList.remove('text-danger');
          feedBackField.textContent = i18Instance.t('rssAdded');
          renderAll(state.feeds, state.posts);
          form.elements.url.value = '';
          break;
        default:
          throw new Error('Unexpected formStatus value');
      }
    };

    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'formStatus':
          formStatusHandler(value);
          break;
        case 'errorValue':
          formErrorRender(value, inputField, feedBackField, fieldset, i18Instance);
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

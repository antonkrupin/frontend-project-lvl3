import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { updateRss } from './handlers';
import renderFeeds from './renders';
// eslint-disable-next-line no-unused-vars
import getTimeout from './reconnectionTimer';

const app = () => {
  const state = {
    feeds: [],
    feedsObjects: [],
    posts: [],
    errorValue: '',
    networkError: false,
    formStatus: 'filling',
    buttons: [],
  };

  const inputField = document.querySelector('#url-input');
  const feedBackField = document.querySelector('.feedback');

  const i18Instance = i18next.createInstance();

  i18Instance.init({
    lng: 'ru',
    resources,
  });

  yup.setLocale({
    string: {
      url: i18Instance.t('errors.urlFormat'),
    },
    mixed: {
      notOneOf: i18Instance.t('errors.urlRepeat'),
    },
  });

  const fieldsRender = (target, addedClass, removedClass = 'test') => {
    target.classList.add(addedClass);
    target.classList.remove(removedClass);
  };

  const watchedState = onChange(state, (path, value) => {
    // eslint-disable-next-line default-case
    switch (path) {
      case 'formStatus':
        switch (value) {
          case 'processing':
            state.networkError = false;
            fieldsRender(feedBackField, 'text-success', 'text-danger');
            feedBackField.textContent = i18Instance.t('watching');
            break;
          case 'processed':
            fieldsRender(inputField, 'is-valid', 'is-invalid');
            fieldsRender(feedBackField, 'text-success', 'text-danger');
            feedBackField.textContent = i18Instance.t('urlAdded');
            renderFeeds(state.feedsObjects);
            break;
          case 'networkFailure':
            fieldsRender(inputField, 'is-invalid');
            fieldsRender(feedBackField, 'text-danger', 'text-success');
            feedBackField.textContent = i18Instance.t('errors.networkProblems');
            break;
          case 'failure':
            fieldsRender(inputField, 'is-invalid');
            fieldsRender(feedBackField, 'text-danger', 'text-success');

            if (state.errorValue === i18Instance.t('errors.urlRepeat')) {
              feedBackField.textContent = i18Instance.t('errors.urlRepeat');
            } else {
              feedBackField.textContent = i18Instance.t('errors.urlFormat');
            }
            if (state.errorValue === 'TypeError') {
              feedBackField.textContent = i18Instance.t('errors.notRssUrl');
            }
            break;
          default:
            throw new Error('Unexpected formStatus value');
        }
    }
  });
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    handler(e, watchedState);
  });

  updateRss(state);
};

export default app;

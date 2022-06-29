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
    formStatus: 'filling',
  };

  const inputField = document.querySelector('#url-input');
  const feedBackField = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');

  const i18Instance = i18next.createInstance();

  i18Instance.init({
    lng: 'ru',
    resources,
  });

  yup.setLocale({
    string: {
      url: i18Instance.t('errors.notValidUrlFormat'),
    },
    mixed: {
      notOneOf: i18Instance.t('errors.rssRepeat'),
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
            fieldsRender(feedBackField, 'text-success', 'text-danger');
            feedBackField.textContent = i18Instance.t('watching');
            break;
          case 'processed':
            fieldsRender(inputField, 'is-valid', 'is-invalid');
            fieldsRender(feedBackField, 'text-success', 'text-danger');
            feedBackField.textContent = i18Instance.t('rssAdded');
            renderFeeds(state.feedsObjects);
            form.elements.url.value = '';
            break;
          case 'networkFailure':
            fieldsRender(inputField, 'is-invalid');
            fieldsRender(feedBackField, 'text-danger', 'text-success');
            feedBackField.textContent = i18Instance.t('errors.networkProblems');
            break;
          case 'failure':
            fieldsRender(inputField, 'is-invalid');
            fieldsRender(feedBackField, 'text-danger', 'text-success');

            if (state.errorValue === i18Instance.t('errors.rssRepeat')) {
              feedBackField.textContent = i18Instance.t('errors.rssRepeat');
            } else {
              feedBackField.textContent = i18Instance.t('errors.notValidUrlFormat');
            }
            if (state.errorValue === 'TypeError') {
              feedBackField.textContent = i18Instance.t('errors.notHaveValidRss');
            }
            break;
          default:
            throw new Error('Unexpected formStatus value');
        }
    }
  });

  form.addEventListener('submit', (e) => {
    handler(e, watchedState);
  });

  updateRss(state);
};

export default app;

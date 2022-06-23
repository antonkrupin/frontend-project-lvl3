import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler from './handlers';

const app = () => {
  const state = {
    feeds: [],
    feedsObjects: [],
    errorValue: '',
    formStatus: 'filling',
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
    console.log(path);
    console.log(value);
    // eslint-disable-next-line default-case
    switch (path) {
      case 'formStatus':
        switch (value) {
          case 'processing':
            break;
          case 'processed':
            fieldsRender(inputField, 'is-valid', 'is-invalid');
            fieldsRender(feedBackField, 'text-success', 'text-danger');
            feedBackField.textContent = state.errorValue;
            break;
          case 'failure':
            fieldsRender(inputField, 'is-invalid');
            fieldsRender(feedBackField, 'text-danger', 'text-success');
            feedBackField.textContent = state.errorValue;
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
};

export default app;

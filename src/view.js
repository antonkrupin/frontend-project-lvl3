import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';

import resources from './locales/index';
import handler, { updateRss } from './handlers';
import renderAll from './renders';

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

    const errorsRender = (input, feedback, errorText) => {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      // eslint-disable-next-line no-param-reassign
      feedback.textContent = errorText;
    };

    const formErrorHandler = (error) => {
      switch (error) {
        case 'AxiosError':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.networkProblems'));
          fieldset.removeAttribute('disabled', 'disabled');
          break;
        case 'rssRepeat':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.rssRepeat'));
          fieldset.removeAttribute('disabled', 'disabled');
          break;
        case 'notValidUrlFormat':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.notValidUrlFormat'));
          fieldset.removeAttribute('disabled', 'disabled');
          break;
        case 'TypeError':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.notHaveValidRss'));
          fieldset.removeAttribute('disabled', 'disabled');
          break;
        default:
          throw new Error('Unexpected error value');
      }
    };

    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'formStatus':
          formStatusHandler(value);
          break;
        case 'errorValue':
          formErrorHandler(value);
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

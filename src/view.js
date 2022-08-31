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

  const i18Instance = i18next.createInstance();

  i18Instance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    yup.setLocale({
      string: {
        url: i18Instance.t('errors.notValidUrlFormat'),
      },
      mixed: {
        notOneOf: i18Instance.t('errors.rssRepeat'),
      },
    });

    const formStatusHandler = (status) => {
      switch (status) {
        case 'processing':
          // fieldsRender(feedBackField, 'text-success', 'text-danger');
          feedBackField.classList.add('text-success');
          feedBackField.classList.remove('text-danger');
          feedBackField.textContent = i18Instance.t('watching');
          break;
        case 'processed':
          // fieldsRender(inputField, 'is-valid', 'is-invalid');
          inputField.classList.add('is-valid');
          inputField.classList.remove('is-invalid');
          // fieldsRender(feedBackField, 'text-success', 'text-danger');
          feedBackField.classList.add('text-success');
          feedBackField.classList.remove('text-danger');
          feedBackField.textContent = i18Instance.t('rssAdded');
          renderAll(state.feeds, state.posts);
          form.elements.url.value = '';
          break;
        /* case 'networkFailure':
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
          break; */
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
          break;
        case 'RSS уже существует':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.rssRepeat'));
          break;
        case 'Ссылка должна быть валидным URL':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.notValidUrlFormat'));
          break;
        case 'TypeError':
          errorsRender(inputField, feedBackField, i18Instance.t('errors.notHaveValidRss'));
          break;
        default:
          throw new Error('Unexpected error value');
      }
    };

    const watchedState = onChange(state, (path, value) => {
      // eslint-disable-next-line default-case
      switch (path) {
        case 'formStatus':
          formStatusHandler(value);
          break;
        case 'errorValue':
          formErrorHandler(value);
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

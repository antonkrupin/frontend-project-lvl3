import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';

import resources from './locales/index';

const app = (state) => {
  const inputField = document.querySelector('#url-input');
  const sendBtn = document.querySelector('#submit-btn');
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

  const schema = yup.object().shape({
    // разобраться с работой notOneOf
    link: yup.string().url().notOneOf(['http://google.ru']),
  });

  const validate = (fields) => {
    try {
      return schema.validate(fields).then((e) => e);
    } catch (e) {
      return e;
    }
  };
  const raw = encodeURIComponent('https://lorem-rss.herokuapp.com/feed');
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${raw}`;
  let test = [];

  axios({
    method: 'get',
    url: link,
  }).then((response) => {
    console.log(response.status);
    //console.log(response.data.contents);
    const data = response.data.contents;
    const parser = new DOMParser();
    test.push(parser.parseFromString(data, 'application/xml'));
  });

  console.log(test);

  const fieldsRender = (target, addedClass, removedClass = 'test') => {
    target.classList.add(addedClass);
    target.classList.remove(removedClass);
  };

  const feedsWatcher = onChange(state, () => {
    fieldsRender(inputField, 'is-valid', 'is-invalid');
    fieldsRender(feedBackField, 'text-success', 'text-danger');
    feedBackField.innerText = state.errorValue;
  });

  const errorsWatcher = onChange(state, () => {
    fieldsRender(inputField, 'is-invalid');
    fieldsRender(feedBackField, 'text-danger', 'text-success');
    feedBackField.innerText = state.errorValue;
  });

  sendBtn.addEventListener('click', (e) => {
    if (inputField.value !== '') {
      e.preventDefault();
    }
    validate({ link: inputField.value }).then((el) => {
      if (el.link !== '') {
        if (feedsWatcher.feeds.indexOf(el.link) === -1) {
          errorsWatcher.errorValue = i18Instance.t('urlAdded');
          feedsWatcher.feeds.push(el.link);
          inputField.value = '';
          inputField.focus();
        } else {
          inputField.focus();
        }
      }
    }).catch((error) => {
      errorsWatcher.errorValue = error.errors;
      inputField.focus();
    });
  });
};

export default app;

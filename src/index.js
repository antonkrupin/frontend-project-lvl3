import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import onChange from 'on-change';

import init from './init';
import validate from './validate';

const state = init();

const inputField = document.querySelector('#url-input');
const sendBtn = document.querySelector('#submit-btn');
const feedBackField = document.querySelector('.feedback');

const fieldText = [
  'Ссылка должна быть валидным URL',
  'RSS уже существует',
  'RSS успешно загружен',
];

const inputWatcher = onChange(state, (path, value, prev) => {
  console.log('inputwatcher');
  console.log(path);
});

const feedsWatcher = onChange(state, (path, value, prev) => {
  inputField.classList.remove('is-invalid');
  inputField.classList.add('is-valid');

  feedBackField.classList.remove('text-danger');
  feedBackField.classList.add('text-success');

  [, , feedBackField.innerText] = fieldText;
});

const errorsWatcher = onChange(state, (path, value, prev) => {
  inputField.classList.add('is-invalid');

  feedBackField.classList.remove('text-success');
  feedBackField.classList.add('text-danger');
  if (path === 'errors.repeatErrors') {
    [, feedBackField.innerText] = fieldText;
  } else {
    [feedBackField.innerText] = fieldText;
  }
});

inputField.addEventListener('change', (e) => {
  inputWatcher.urlInput = e.target.value;
});

sendBtn.addEventListener('click', (e) => {
  if (state.urlInput !== 'blank') {
    e.preventDefault();
  }
  state.activeLink = inputField.value;
  validate({ link: state.activeLink }).then((el) => {
    if (el.link !== '') {
      if (feedsWatcher.feeds.indexOf(el.link) === -1) {
        feedsWatcher.feeds.push(el.link);
      } else {
        errorsWatcher.errors.repeatErrors += 1;
      }
    }
  }).catch(() => {
    errorsWatcher.errors.formatErrors += 1;
  });
  console.log(state);
});

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
  'Ссылка дложна быть валидным URL',
  'RSS уже существует',
  'RSS успешно загружен',
]

const inputWatcher = onChange(state, (path, value, prev) => {
  console.log('inputwatcher');
  console.log(path);
  /*switch (path) {
    case 'urlInput':
      console.log('urlInput');
      inputField.classList.add('is-invalid');
      [feedBackField.innerText] = fieldText;
      break;
    case 'feeds':
      console.log('feeds');
      inputField.classList.add('is-valid');
      [, , feedBackField.innerText] = fieldText;
      break;
    case 'errors':
      console.log('errors');
      break;
    default:
      throw new Error('Error');
  }*/
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

  [feedBackField.innerText] = fieldText;
  errorsWatcher.errors = '';
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
      feedsWatcher.feeds.push(el.link);
    }
  }).catch(() => {
    errorsWatcher.errors1.formatErrors += 1;
  });
  console.log(state);
});

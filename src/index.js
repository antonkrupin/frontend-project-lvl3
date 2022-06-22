import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import onChange from 'on-change';

import init from './init';
import validate from './validate';

const state = init();

const inputField = document.querySelector('#url-input');
const sendBtn = document.querySelector('#submit-btn');
const feedBackField = document.querySelector('.feedback');

const watchedState = onChange(state, (path, value, prev) => {
  switch (path) {
    case 'urlInput':
      inputField.classList.add('is-invalid');
      feedBackField.innerText = 'Ссылка дложна быть валидным URL';
      break;
    case 'feeds':
      break;
    case 'errors':
      break;
    default:
      throw new Error('Error');
  }
});

inputField.addEventListener('change', (e) => {
  if (e.target.value !== '') {
    watchedState.urlInput = 'filled';
  }
});

sendBtn.addEventListener('click', (e) => {
  if (state.urlInput !== 'blank') {
    e.preventDefault();
  }
  state.activeLink = inputField.value;
  validate({ link: state.activeLink }).then((el) => {
    if (el.link !== '') {
      state.feeds.push(el.link);
    }
  }).catch(() => {
    state.errors = 'Wrong link format';
  });
  console.log(state);
});

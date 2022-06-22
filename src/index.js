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
  });
  console.log(state);

  
  /*const validationResult = validate({ link: state.activeLink });
  let test;
  validationResult.then((el) => {
    console.log('Testing');
    test = el;
  });
  console.log(`test - ${test}`);
  console.log('state feeds')
  console.log(state.feeds);*/
  //console.log(validationResult);
  /*validationResult.then((et) => {
    console.log(et);
  });*/
  //console.log(validationResult);
  /*const object = {
    link: '',
  };

  switch (state.urlInput) {
    case 'blank':
      break;
    default:
      console.log('test');
  }*/

  /*const validationResult = validate({ object });
  console.log(validationResult);
  switch (validationResult) {
    case {}:
      feedBackField.innerText = 'RSS успешно загружен';
      feedBackField.classList.remove('text-danger');
      feedBackField.classList.add('text-success');
      inputField.value = '';
    default:
      console.log('test');
      feedBackField.innerText = 'Ссылка дложна быть валидным URL';
  }*/
  
});

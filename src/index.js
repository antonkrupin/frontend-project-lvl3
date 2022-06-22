import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import onChange from 'on-change';

import init from './init';
import validate from './validate';

const state = init();

const inputField = document.querySelector('#url-input');
const sendBtn = document.querySelector('#submit-btn');
const feedBackField = document.querySelector('.feedback');

sendBtn.addEventListener('click', (e) => {
  const object = {
    link: '',
  };

  const validationResult = validate({ object });
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
  }
  
});

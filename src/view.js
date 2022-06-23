import onChange from 'on-change';
import * as yup from 'yup';

const app = (state) => {
  const inputField = document.querySelector('#url-input');
  const sendBtn = document.querySelector('#submit-btn');
  const feedBackField = document.querySelector('.feedback');

  yup.setLocale({
    string: {
      url: 'Ссылка должна быть валидным URL',
    },
    mixed: {
      notOneOf: 'RSS уже существует',
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

  const fieldsRender = (target, addedClass, removedClass = 'test') => {
    target.classList.add(addedClass);
    target.classList.remove(removedClass);
  };

  const feedsWatcher = onChange(state, () => {
    fieldsRender(inputField, 'is-valid', 'is-invalid');
    fieldsRender(feedBackField, 'text-success', 'text-danger');
    feedBackField.innerText = 'RSS успешно загружен';
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

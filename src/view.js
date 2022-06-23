import onChange from 'on-change';
import * as yup from 'yup';

const app = (state) => {
  const inputField = document.querySelector('#url-input');
  const sendBtn = document.querySelector('#submit-btn');
  const feedBackField = document.querySelector('.feedback');

  const fieldText = [
    'Ссылка должна быть валидным URL',
    'RSS уже существует',
    'RSS успешно загружен',
  ];

  const schema = yup.object().shape({
    // разобраться с работой notOneOf
    link: yup.string().url().notOneOf(state.feeds),
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

    [, , feedBackField.innerText] = fieldText;
  });

  const errorsWatcher = onChange(state, (path) => {
    fieldsRender(inputField, 'is-invalid');
    fieldsRender(feedBackField, 'text-danger', 'text-success');

    switch (path) {
      case 'errors.repeatErrors':
        [, feedBackField.innerText] = fieldText;
        break;
      case 'errors.formatErrors':
        [feedBackField.innerText] = fieldText;
        break;
      default:
        throw new Error('Wrong error typs');
    }
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
        } else {
          errorsWatcher.errors.repeatErrors += 1;
        }
      }
    }).catch(() => {
      errorsWatcher.errors.formatErrors += 1;
    });
  });
};

export default app;

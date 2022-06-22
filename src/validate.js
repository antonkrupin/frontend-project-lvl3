import * as yup from 'yup';

const schema = yup.object().shape({
  link: yup.string().url().required(),
});

const validate = (fields) => {
  try {
    schema.validate(fields);
    return {};
  } catch (e) {
    return e;
  }
};

export default validate;

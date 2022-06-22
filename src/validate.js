import * as yup from 'yup';

const schema = yup.object().shape({
  link: yup.string().url(),
});

const validate = (fields) => {
  try {
    return schema.validate(fields);
  } catch (e) {
    return e;
  }
};

export default validate;

import * as yup from 'yup';

const schema = yup.object().shape({
  link: yup.string().url(),
});

const validate = (fields) => {
  try {
    return schema.validate(fields).then((e) => e);
  } catch (e) {
    return e;
  }
};

export default validate;

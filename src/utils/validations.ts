import inputNames from '../constants/inputNames';
import errors from '../constants/errors';

const isEmail = (email: string): string => {
  const pattern = /^([a-zA-Z0-9_.-d\+1/])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  return pattern.test(email) ? '' : errors.EMAIL_INVALID;
};

const isPassword = (password: string): string => {
  const pattern = /(?=.*\d)(?=.*[a-z/а-я])(?=.*[A-Z/А-Я]).{8,}/;

  return pattern.test(password) ? '' : errors.PASSWORD_INVALID;
};

const isPasswordSame = (repeatedPassword: string): string => {
  let password = (<HTMLInputElement>(document.querySelector(`input[name="${inputNames.PASSWORD}"]`)))?.value ?? '';
  if (!password) {
    password = (<HTMLInputElement>(document.querySelector(`input[name="${inputNames.NEW_PASSWORD}"]`)))?.value ?? '';
  }

  return repeatedPassword === password ? '' : errors.PASSWORD_REPEAT;
};

const isNotEmpty = (value: string): string => value ? '' : errors.FILL_FIELD;

const isPhone = (phone = ''): string => {
  const pattern = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

  return pattern.test(phone.replace(' ', '')) ? '' : errors.PHONE_INVALID;
};

export {
  isEmail,
  isNotEmpty,
  isPassword,
  isPasswordSame,
  isPhone,
};

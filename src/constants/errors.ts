const errors = {
  EMAIL_INVALID: 'Введите корректный почтовый адрес',
  EVENT_NOT_FOUND: (event: string): string => `Событие не найдено: ${event}`,
  FILL_FIELD: 'Заполните поле',
  NOT_ALLOWED: 'В доступе отказано',
  PASSWORD_INVALID: 'Пароль должен содержать не менее 8 символов, включая цифры, строчные и прописные буквы',
  PASSWORD_REPEAT: 'Пароли не совпадают',
  PHONE_INVALID: 'Введите корретный номер',
  RESPONSE_FAILED: 'Бешеные лемуры бегают по кругу'
};

export default errors;

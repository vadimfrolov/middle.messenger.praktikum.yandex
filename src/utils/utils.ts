import inputNames from '../constants/inputNames';

const generateRandomString = (): string => `_${Math.random().toString(36)
  .substr(2, 10)}`;

const getFormData = (form: HTMLFormElement): Record<string, FormDataEntryValue> => Object.fromEntries((new FormData(form).entries()));

const getName = (event: Event): string => {
  let name = (<HTMLInputElement>event.target)?.name;

  switch (name) {
    case inputNames.NAME:
      name = 'name';
      break;
    case inputNames.SURNAME:
      name = 'surname';
      break;
      // case inputNames.CHAT_NAME:
      //   name = 'chatName';
      // break;
    default:
      break;
  }

  return name;
};

export { generateRandomString, getFormData, getName };

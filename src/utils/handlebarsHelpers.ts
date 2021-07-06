import Handlebars from 'handlebars';

interface IDateStringOptions {
  minute?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
}

Handlebars.registerHelper('img', (src: string, options: Record<string, Record<string, string>>) => `<img src='${src}'${options.hash.class ? ' class=\'' + options.hash.class + '\'': ''} alt='${options.hash.alt}' />`);

Handlebars.registerHelper('date', (src: string) => {
  if (!src) { return ''; }
  const date = new Date(src);
  const options: IDateStringOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  if (date.getDate() !== new Date().getDate()
    || date.getMonth() !== new Date().getMonth()
    || date.getFullYear() !== new Date().getFullYear()) {
    options.day = 'numeric';
    options.month = 'short';
  }

  if (date.getFullYear() !== new Date().getFullYear()) {
    options.year = 'numeric';
  }

  return new Date(src).toLocaleTimeString('ru-RU', options);
});

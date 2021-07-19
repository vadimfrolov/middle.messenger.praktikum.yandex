module.exports = function (src: string, options: Record<string, Record<string, string>>) {
  return `<img src='${src}'${options.hash.class ? ' class=\'' + options.hash.class + '\'': ''} alt='${options.hash.alt}' />`
}

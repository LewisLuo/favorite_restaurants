const handlebars = require('handlebars')

handlebars.registerHelper('isMached', function (a, b, options) {
  if (a === b) {
    return 'selected'
  }
})
const handlebars = require('handlebars')

handlebars.registerHelper('isMatched', function (a, b, options) {
  if (a === b) {
    return 'selected'
  }
})
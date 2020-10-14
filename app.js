// Server-relative variables
const express = require('express')
const app = express()
const port = 3000

// Plugins inclusion
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Handelbar helpers
const isMatched = require('./utils/isMatched')

// Routers and database
const routes = require('./routes')
require('./config/mongoose')

// App tamplate engines
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// Server listen message
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`)
})
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const bodyParser = require('body-parser')
const restaurantList = require('./restaurant.json').results

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/favorite-restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => { console.log('mongoose error!') })
db.once('open', () => { console.log('mongoose connected!') })

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const showedRestaurant = restaurantList.filter((restaurant) => restaurant.id === Number(req.params.restaurant_id))
  console.log(showedRestaurant)
  res.render('show', { restaurant: showedRestaurant[0] })
})

app.get('/search', (req, res) => {
  const searchedRestaurants = restaurantList.filter((restaurant) => restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase().trim()) || restaurant.name_en.toLowerCase().includes(req.query.keyword.toLowerCase().trim()))

  if (searchedRestaurants.length !== 0) {
    res.render('index', { restaurants: searchedRestaurants, keyword: req.query.keyword })
  } else {
    res.render('search_fail', { keyword: req.query.keyword })
  }
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
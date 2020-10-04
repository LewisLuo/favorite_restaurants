const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const bodyParser = require('body-parser')
const restaurantList = require('./restaurant.json').results

const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const restaurant = require('./models/restaurant')

mongoose.connect('mongodb://localhost/favorite-restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => { console.log('mongoose error!') })
db.once('open', () => { console.log('mongoose connected!') })

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants: restaurants }))
    .catch(error => { console.log('Error from mongoose-1') })
})

//新增restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const body = req.body

  return Restaurant.create({
    name: body.name,
    name_en: body.name_en,
    category: body.category,
    image: body.image,
    location: body.location,
    phone: body.phone,
    google_map: body.google_map,
    rating: body.rating,
    description: body.description
  })
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-create') })
})

//觀看restaurant內容
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => { console.log('Error from mongoose-2') })
})

//搜尋restaurants
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const modifiedKeyword = req.query.keyword.toLowerCase().trim()

  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const searchedRestaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(modifiedKeyword) || restaurant.name_en.toLowerCase().includes(modifiedKeyword))
      if (searchedRestaurants.length === 0) {
        res.render('search_fail', { keyword })
      } else {
        res.render('index', { restaurants: searchedRestaurants, keyword })
      }
    })
    .catch(error => { console.log('Error from mongoose-3') })
})

//新增restaurant



app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
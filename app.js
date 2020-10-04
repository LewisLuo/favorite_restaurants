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
    .catch(error => { console.log('Error from mongoose-index') })
})

//新增restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-create') })
})

//觀看restaurant內容
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, restaurant_id }))
    .catch(error => { console.log('Error from mongoose-show') })
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
    .catch(error => { console.log('Error from mongoose-search') })
})

//編輯restaurant
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => { console.log('Error from mongoose-edit-1') })
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .then((restaurant) => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => { console.log('Error from mongoose-edit-2') })
})

//刪除restaurant
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .then((restaurant) => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-delete') })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
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
    .catch(error => { console.log('Error from mongoose') })
})

//觀看detail
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.find({ id: restaurant_id })
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant[0] }))
    .catch(error => { console.log('Error from mongoose') })
})

//搜尋
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
        console.log(searchedRestaurants)
        res.render('index', { restaurants: searchedRestaurants, keyword })
      }
    })
    .catch(error => { console.log('Error from mongoose') })


  // const searchedRestaurants = restaurantList.filter((restaurant) => restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase().trim()) || restaurant.name_en.toLowerCase().includes(req.query.keyword.toLowerCase().trim()))

})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
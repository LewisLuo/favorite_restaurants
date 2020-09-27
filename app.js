const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000

const restaurantList = require('./restaurant.json').results

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

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
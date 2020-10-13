const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/search', (req, res) => {
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

module.exports = router
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  let sortFilter, order, orderName

  switch (req.query.sort) {
    case 'name':
      sortFilter = 'name'
      order = 'asc'
      orderName = '餐廳名 (A -> Z)'
      break;
    case 'name-r':
      sortFilter = 'name'
      order = 'desc'
      orderName = '餐廳名 (Z -> A)'
      break;
    case 'category':
      sortFilter = 'category'
      order = 'asc'
      orderName = '類別'
      break;
    case 'location':
      sortFilter = 'location'
      order = 'asc'
      orderName = '地區'
      break;
    default:
      sortFilter = '_id'
      order = 'asc'
      orderName = '排序'
  }

  Restaurant.find()
    .lean()
    .sort({ [sortFilter]: [order] })
    .then((restaurants) => res.render('index', { restaurants: restaurants, orderName }))
    .catch(error => { console.log('Error from mongoose-index') })
})

//搜尋restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const modifiedKeyword = req.query.keyword.toLowerCase().trim()

  let sortFilter, order, orderName

  switch (req.query.sort) {
    case 'name':
      sortFilter = 'name'
      order = 'asc'
      orderName = '餐廳名 (A -> Z)'
      break;
    case 'name-r':
      sortFilter = 'name'
      order = 'desc'
      orderName = '餐廳名 (Z -> A)'
      break;
    case 'category':
      sortFilter = 'category'
      order = 'asc'
      orderName = '類別'
      break;
    case 'location':
      sortFilter = 'location'
      order = 'asc'
      orderName = '地區'
      break;
    default:
      sortFilter = '_id'
      order = 'asc'
      orderName = '排序'
  }


  if (!modifiedKeyword) {
    const alertHTML = 'show alert'
    Restaurant.find()
      .lean()
      .sort({ [sortFilter]: [order] })
      .then((restaurants) => res.render('index', { restaurants: restaurants, orderName, alertHTML }))
      .catch(error => { console.log('Error from mongoose-index') })
  } else {
    return Restaurant.find()
      .lean()
      .sort({ [sortFilter]: [order] })
      .then((restaurants) => {
        const searchedRestaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(modifiedKeyword) || restaurant.name_en.toLowerCase().includes(modifiedKeyword))
        if (searchedRestaurants.length === 0) {
          res.render('search_fail', { keyword, orderName })
        } else {
          res.render('index', { restaurants: searchedRestaurants, keyword, orderName })
        }
      })
      .catch(error => { console.log('Error from mongoose-search') })
  }
})

module.exports = router
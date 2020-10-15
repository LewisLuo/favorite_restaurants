const express = require('express')
const router = express.Router()
const categories = require('../../models/restaurant_categories')

const Restaurant = require('../../models/restaurant')

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

//新增restaurant
router.get('/new', (req, res) => {
  res.render('new', { categories })
})

router.post('/new/preview', (req, res) => {
  const previewInfo = req.body
  if (previewInfo.category === '請選擇用餐類型') {
    previewInfo.category = ''
  }
  res.render('new_preview', { previewInfo })
})

router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-create') })
})

//觀看restaurant內容
router.get('/:restaurant_id', (req, res) => {
  return Restaurant.findById(req.params.restaurant_id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => { console.log('Error from mongoose-show') })
})

//編輯restaurant
router.get('/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant, categories }))
    .catch(error => { console.log('Error from mongoose-edit-1') })
})

router.post('/:restaurant_id/edit/preview', (req, res) => {
  res.render('edit_preview', { previewInfo: req.body })
})

router.put('/:restaurant_id', (req, res) => {
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
router.delete('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .then((restaurant) => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-delete') })
})

module.exports = router
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//新增restaurant
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/new/preview', (req, res) => {
  res.render('new_preview', { previewInfo: req.body })
})

router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => { console.log('Error from mongoose-create') })
})

//觀看restaurant內容
router.get('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, restaurant_id }))
    .catch(error => { console.log('Error from mongoose-show') })
})

//編輯restaurant
router.get('/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
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
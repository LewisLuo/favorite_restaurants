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

module.exports = router
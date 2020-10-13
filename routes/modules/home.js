const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants: restaurants }))
    .catch(error => { console.log('Error from mongoose-index') })
})

module.exports = router
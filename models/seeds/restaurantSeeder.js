const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')

const seedList = require('./restaurant.json').results

mongoose.connect('mongodb://localhost/favorite-restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => { console.log('mongoose error!') })

db.once('open', () => {
  console.log('mongoose connected!')
  for (let i = 0; i < seedList.length; i++) {
    Restaurant.create({
      id: seedList[i].id,
      name: seedList[i].name,
      name_en: seedList[i].name_en,
      category: seedList[i].category,
      image: seedList[i].image,
      location: seedList[i].location,
      phone: seedList[i].phone,
      google_map: seedList[i].google_map,
      rating: seedList[i].rating,
      description: seedList[i].description
    })
    console.log(`第${i + 1}筆資料完成`)
  }
  console.log('done.')
})
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Provider = mongoose.model('Provider')

router.post('/', async (req, res, next) => {
  try {
    Provider.create(req.body)
      .then((provider) => {
        res.status(200).json(provider)
      })
      .catch((err) => {
        next(err)
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router

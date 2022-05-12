const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Provider = mongoose.model('Provider')

router.get('/', async (req, res, next) => {
  try {
    Provider.find(req.query)
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

router.get('/:id', async (req, res, next) => {
  try {
    Provider.findById(req.params.id)
      .exec()
      .then((provider) => {
        res.status(200).json(provider)
      })
      .catch((err) => {
        res.status(404).json({
          message: `Provider with id ${req.params.id} not found`
        })
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router

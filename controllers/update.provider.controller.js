const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Provider = mongoose.model('Provider')

router.put('/:id', async (req, res, next) => {
  try {
    const doc = await Provider.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        upsert: true
      }
    )
    res.status(200).json(doc)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      upsert: false
    })
    if (doc) {
      res.status(200).json(doc)
    } else {
      res.status(404).json({
        message: `Provider with id ${req.params.id} not found and cannot be updated`
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router

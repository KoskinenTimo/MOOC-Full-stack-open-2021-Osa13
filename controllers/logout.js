const { Session } = require('../models')

const router = require('express').Router()

router.delete('/', async (req,res,next) => {
  try {
    const authorization = req.get('authorization')
    const token = authorization.substring(7)
    await Session.destroy({ where: { token } })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
const router = require('express').Router()
const { Readinglist } = require('../models')
const { sequelize } = require('../models/blog')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req,res,next) => {
  try {
    const userId = req.body.user_id
    const blogId = req.body.blog_id
    const readinglist = await Readinglist.create({ userId, blogId })
    res.status(201).json(readinglist)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req,res,next) => {
  const readinglist = await Readinglist.findByPk(req.params.id)
  const { read } = req.body
  if (req.decodedToken.id !== readinglist.id) return next(new Error('not the owner of the readinglist'))
  if (typeof(read) !== 'boolean') return next(new Error('read is not a boolean value'))
  if (readinglist) {
    try {
      readinglist.read = read
      await readinglist.save()
      res.json(readinglist)
    } catch (error) {
      next(error)
    }
  } else {
    const err = new Error('Readinglist not found')
    err.status = 404
    next(err)
  }
})

module.exports = router
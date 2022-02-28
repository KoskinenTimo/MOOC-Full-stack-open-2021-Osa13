const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')


const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  where = {}

  if (req.query.serch) {
    where = { 
      [Op.or]: [
        { title: { [Op.substring]: req.query.serch } },
        { author: { [Op.substring]: req.query.serch } }
      ]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  try {
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).end()
  }
  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.status(204).end()
  }else {
    res.status(401).json({ error: 'not the blog owner' })
  }
})

router.put('/:id', blogFinder, async(req, res) => {
  if (req.blog) {
    if (!req.body.likes) throw new Error('No "likes" property')
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
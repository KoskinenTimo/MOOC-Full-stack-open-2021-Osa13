const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../models/blog')


router.get('/', async (req,res) => {
  const data = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('blog')), 'blog'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
  })
  res.json(data)
})

module.exports = router
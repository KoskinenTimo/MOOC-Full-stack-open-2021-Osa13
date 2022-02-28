const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    },
    attributes: { exclude: ['userId', 'passwordhash'] }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordhash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({
      username,
      name,
      passwordhash
    })   
    res.json({
      id: user.id,
      username:user.username,
      name:user.name

    })
  } catch(error) {
    return res.status(400).json({ message: error.message })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (user) {
    await User.update(
      { username: req.body.username},
      { where: { username: req.params.username } })
      const updatedUser = await User.findOne({ where: { username: req.params.username } })
    const parsedUser = updatedUser.toJSON()
    const { passwordhash, ...rest } = parsedUser
    res.json(rest)
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req,res, next) => {
  let { read } = req.query
  if (read === 'true') {
    read = true
  } else if (read === 'false') {
    read = false
  } else {
    read = null
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: 'readings',
        through: {
          where: typeof(read) === 'boolean' ? { 'read': read } : '',
          attributes: ['id', 'read']
        },
      }
    ],
    attributes: { exclude: ['passwordhash'] }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
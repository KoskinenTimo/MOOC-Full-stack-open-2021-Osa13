const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { SECRET } = require('../util/config')
const User = require('../models/user')
const { Session } = require('../models')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled'
    })
  }

  if (!user) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const passwordCorrect = await bcrypt.compare(password, user.passwordhash)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  try {
    await Session.create({ token })
  } catch (error) {
    return next(error)
  }
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
const jwt = require('jsonwebtoken')
const { User, Session } = require('../models')
const { SECRET } = require('./config')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const logged = await isLoggedIn(token)
      if (!logged) {
        return res.status(401).json({ error: 'not logged in' })
      }
      const notDisabled = await isNotDisabled(req.decodedToken.id)
      if (!notDisabled) {
        return res.status(401).json({ error: 'account disabled' })
      }
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const isLoggedIn = async (token) => {
  const session = await Session.findOne({ where: { token } })
  if (session) {
    return true
  }
  return false
}

const isNotDisabled = async (id) => {
  const user = await User.findByPk(id)
  if (!user || user.disabled === true) {
    return false
  }
  return true
}

module.exports = {
  tokenExtractor
}
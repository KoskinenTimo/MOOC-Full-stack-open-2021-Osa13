const express = require('express')
require('express-async-errors')

const app = express()
app.use(express.json())

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use((req,res,next) => {
  res.status(404).send({ error: 'Endpoint not found' })
})

app.use((error,req,res,next) => {
  res.status(error.status || 500).json({ error: error.message })
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
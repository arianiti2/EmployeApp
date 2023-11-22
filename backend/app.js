const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv/config')
const bodyParser = require('body-parser')
const api = process.env.API_URL
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())
app.options('*', cors())

//Middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

//Routes
const usersRoutes = require('./routes/users')

app.use(`${api}/users`, usersRoutes)

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, { dbName: 'OCAUsers' })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(5000, () => {
  console.log(api)
  console.log('server is running on port 5000')
})

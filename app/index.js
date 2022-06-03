const express = require('express')
const morgan = require('morgan')
const path = require('path')
const router = require('../config/routes')
const cors = require('cors')

const app = express()

/** Install request logger */
app.use(morgan('dev'))

// cors
app.use(cors())

/** Install JSON request parser */
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

/** Install Router */
app.use(router)

module.exports = app

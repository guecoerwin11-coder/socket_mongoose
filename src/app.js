const express = require('express')
const path  = require('path')

const authRouter = require('../src/routes/route')
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/auth', authRouter)

module.exports = app;


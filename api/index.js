require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const routerApi = require('./routes')
const { dbConnectMysql } = require('./config/mysql')
const { boomErrorHandler, errorHandler } = require('./middleware/error.handler')

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000

routerApi(app)
app.use(errorHandler)
app.use(boomErrorHandler)

app.listen(port, () => {
    console.log('http://localhost:' + port);
})

dbConnectMysql()
const peopleRouter = require('./people.router')
const express = require('express')
const router = express.Router()

function routerApi(app){
    app.use('/api/v1', router)
    router.use('/people', peopleRouter)
}

module.exports = routerApi
const boom = require('@hapi/boom')
const { validationResult } = require('express-validator')

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (error) {
        res.status(403)
        res.send({ error: error.array() })
    }
}

module.exports = validateResults
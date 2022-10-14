const { check } = require('express-validator')
const validateResults = require('../utils/handle.validator')

const validatorCreateItem = [
    check('name', 'Nombre completo').exists().notEmpty(),
    check('identification_number', 'Número de identificación').exists().notEmpty(),
    check('id_type', 'Seleccionar elemento de la lista').exists().notEmpty(),
    check('birthday', 'Seleccionar fecha de nacimiento').exists().notEmpty().isDate(),
    check('weight', 'Campo requerido').exists().notEmpty().isNumeric(),
    check('size', 'Campo requerido').exists().notEmpty().isNumeric(),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

const validatorGetItem = [
    check('id').exists().notEmpty().isNumeric(),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

module.exports = { validatorCreateItem, validatorGetItem }
const express = require('express')
const router = express.Router()
const { getItems, getItem, searchItems, createItem, updateItem, deleteItem } = require('../controllers/people.controller')
const  { validatorCreateItem, validatorGetItem } = require('../validators/people.validator')

router.get('/', getItems)

router.get('/:id', validatorGetItem, getItem)

router.get('/search/:key', searchItems)

router.post('/', validatorCreateItem, createItem)

router.put('/:id', validatorGetItem, validatorCreateItem, updateItem)

router.delete('/:id', validatorGetItem, deleteItem)

module.exports = router
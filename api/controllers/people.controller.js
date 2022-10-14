const { Op } = require("sequelize");
const People = require('../models/people.model')
const { matchedData } = require('express-validator')
const boom = require('@hapi/boom')
/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res, next) =>{
    try {
        const people = await People.findAll()
        res.json(people)
    } catch (error) {
        next(error)
    }
}

/**
 * Obtener un detalle
 * @param {*} req 
 * @param {*} res 
 */
const getItem = async (req, res, next) =>{
    try {
        const { id } = req.params
        const people = await People.findOne({where: {id} })
        if(!people){
            throw boom.notFound('Persona no encontrada')
        }
        res.json(people)
    } catch (error) {
        next(error)
    }
}

const searchItems = async (req, res, next) =>{
    try {
        const { key } = req.params
        const people = await People.findAll({
            where: {
                name:{
                    [Op.like]: `%${key}%`
                }
            }
        })
        res.json(people)
    } catch (error) {
        next(error)
    }
}

/**
 * insertar un registro
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res, next) =>{
    try {
        const { body } = req
        const people = await People.findOne({where: { identification_number: body.identification_number} })
        if(people){
            throw boom.conflict('Ya existe un paciente con el número de identificación ingresado')
        }
        const data = await People.create(body)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

/**
 * Actualizar un registro
 * @param {*} req 
 * @param {*} res 
 */
const updateItem = async (req, res, next) =>{
    try {
        const { id } = req.params
        const { body } = req
        const people = await People.findOne({where: {id} })
        if(!people){
            throw boom.notFound('Persona no encontrada')
        }
        const data = await People.update(
            body,
            {where: {id} }
        )
        res.json(data)
    } catch (error) {
        next(error)
    }
}

/**
 * Eliminar un registro
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res, next) =>{
    try {
        const { id } = req.params
        const people = await People.findOne({where: {id} })
        if(!people){
            throw boom.notFound('Persona no encontrada')
        }
        const data = await People.destroy({ where: {id} })
        res.json(data)
    } catch (error) {
        next(error)
    }
}

module.exports = { getItems, getItem, searchItems, createItem, updateItem, deleteItem }
const { sequelize, dbConnectMysql } = require('../config/mysql')
const { DataTypes } = require('sequelize')

const People = sequelize.define(
    "people",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        identification_number: {
            type: DataTypes.NUMBER,
            allowNull: false,
            unique: true
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false
        },
        weight: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        size: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    },
    {
        timestamps:true
    }
)

module.exports = People

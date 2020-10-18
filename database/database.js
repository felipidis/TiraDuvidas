const Sequelize = require('sequelize')

const connection = new Sequelize('tiraduvidas', 'root','/* senhaDoBD */',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
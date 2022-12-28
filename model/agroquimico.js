//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Agroquimico = sequelize.define('Agroquimico', {
    // atributos
    agroquimicoId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    nombreAgroquimico: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dosisAgroquimico: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    totalAgroquimico: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
}, {
    timestamps: false,
    freezeTableName: true
});
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
    await Agroquimico.sync({ force: false })
}

module.exports = Agroquimico;
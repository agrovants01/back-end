//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Indice = sequelize.define('Indice', {
    // atributos
    indiceId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    nombreIndice: {
        type: Sequelize.STRING,
        allowNull: true
    },
    siglasIndice: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bandasIndice: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, {
    timestamps: false,
    freezeTableName: true,

});
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
    await Indice.sync({ force: false, alter: true })
}

module.exports = Indice;
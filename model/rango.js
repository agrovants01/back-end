//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Rango = sequelize.define('Rango', {
    // atributos
    rangoId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    colorRango: {
        type: Sequelize.STRING,
        allowNull: true
    },
    desdeRango: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    hastaRango: {
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
    await Rango.sync({ force: false })
}

module.exports = Rango;
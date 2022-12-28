//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Coadyuvante = sequelize.define('Coadyuvante', {
    // atributos
    coadyuvanteId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    nombreCoadyuvante: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dosisCoadyuvante: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    totalCoadyuvante: {
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
    await Coadyuvante.sync({ force: false })
}

module.exports = Coadyuvante;
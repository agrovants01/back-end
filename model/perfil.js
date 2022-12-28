//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Perfil = sequelize.define('Perfil', {
    // atributos
    perfilId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    nombrePerfil: {
        type: Sequelize.STRING,
        allowNull: false
    },
    codigoPerfil: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fechaBajaPerfil: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
    await Perfil.sync({ force: false })
}

module.exports = Perfil;
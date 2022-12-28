//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Permiso = sequelize.define('Permiso', {
    // atributos
    permisoId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    codigoPermiso: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fechaBajaPermiso: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    nombrePermiso: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
    /* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
                          y se vuelve a crear*/
});
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
    await Permiso.sync({ force: false })
}

module.exports = Permiso;

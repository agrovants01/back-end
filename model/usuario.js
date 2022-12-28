//Importaciones necesarias
const sequelize = require('../database/config');
const Sequelize = require('sequelize');

const Usuario = sequelize.define('Usuario', {
    // atributos
    usuarioId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,  //se establece que es la clave primaria de la tabla
        unique: true
    },
    nombreUsuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidoUsuario: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    emailUsuario: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    contraseniaUsuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefonoUsuario: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cuitUsuario: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    fechaBajaUsuario: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    nombreUsuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    aliasUsuario: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resetLink: {
        type: Sequelize.STRING,
        default: ''
    },
    lastLoginDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    tokenSession: {
        type: Sequelize.STRING,
        default: ''
    },
}, {
    timestamps: false,
    freezeTableName: true, /* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
                                y se vuelve a crear*/
}
);
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
    await Usuario.sync({ force: false })
}

module.exports = Usuario;


const Perfil = require("../model/perfil");
const sequelize = require("../database/config");

const getPropietarioId = async () => {
    const perfilPropietario = await Perfil.findAll({
        where: {
            fechaBajaPerfil: null,
            nombrePerfil: sequelize.where(sequelize.fn('LOWER', sequelize.col('nombrePerfil')), 'LIKE', '%' + 'propietario' + '%')
        },
        attributes: [
            'perfilId'
        ]
    });

    return perfilPropietario[0].dataValues.perfilId
}

module.exports = {
    getPropietarioId
}



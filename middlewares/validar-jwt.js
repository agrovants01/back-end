//importaciones necesarias
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../model/usuario');

//método para validar si el token asignado al usuario existe y no ha sido modificado
const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findByPk(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (usuario.fechaBajaUsuario !== null) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }


        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}



//exportación necesaria
module.exports = {
    validarJWT
}
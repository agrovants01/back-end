const { request, response } = require("express");
const { Op } = require("sequelize");
const sequelize = require("../database/config");

const Usuario = require("../model/usuario");
const Vuelo = require("../model/vuelo");
const Perfil = require("../model/perfil");

const { getPropietarioId } = require("../helpers/get-perfil-propietario");

const buscarPropietarios = async (req = request, res = response) => {
    //Capturamos el valor de búsqueda
    const parametro = req.query.q.toLocaleLowerCase().trim(); //Parámetro de búsqueda obtenido del query
    let listadoPropietarios = []; //Listado de resultados finales

    try {


        const perfilPropietarioId = await getPropietarioId(); //Obtenemos el id del propietario

        if (!perfilPropietarioId) {
            return res.status(500).json({
                msg: "No existe el perfil de propietario",
            });
        }

        //Obtenemos todos los propietarios
        const propietariosVuelos = await Usuario.findAll({
            attributes: [
                "usuarioId",
                "nombreUsuario",
                "apellidoUsuario",
                "aliasUsuario"
            ],
            where: {
                fechaBajaUsuario: null,
                fk_Perfil: perfilPropietarioId
            },
        });

        //Se obtienen todos los vuelos de cada propietario, en formato: {count: cantidadVuelosEncontrados, rows: fechaDelVuelo}
        for (i in propietariosVuelos) {
            const vuelosPropietario = await Vuelo.findAndCountAll({
                attributes: [
                    'fechaVuelo'
                ],
                where:
                {
                    fk_Usuario: propietariosVuelos[i].usuarioId,
                    //TODO: Ver fecha de baja de vuelo
                },
                order: [
                    ['fechaVuelo', 'DESC']
                ]
            });
            let detalle = null;
            if (vuelosPropietario.rows.length > 0) {
                detalle = vuelosPropietario.rows[0].fechaVuelo;
            }
            //Generamos el objeto a comparar
            const propietarioVuelo = {
                propietario: propietariosVuelos[i],
                ultimoVuelo: {
                    detalle: detalle, //Obtenemos el último vuelo realizado
                    cantidad: vuelosPropietario.count
                }
            }
            propietariosVuelos[i] = propietarioVuelo;
        }


        //Se compara cada propietario con el parámetro recibido
        for (i in propietariosVuelos) {
            const vueloDate = new Date(propietariosVuelos[i].ultimoVuelo.detalle); //Variable auxiliar para convertir la fecha  del vuelo en Date
            const cantidadVuelos = propietariosVuelos[i].ultimoVuelo.cantidad;
            const fechaVueloString = `${vueloDate.getUTCDate().toString()}/${(vueloDate.getUTCMonth() + 1).toString()}/${vueloDate.getFullYear().toString()}`; //Fecha de vuelo en formato mostrado
            if ((propietariosVuelos[i].propietario.nombreUsuario || ' ')
                .trim()
                .toLocaleLowerCase()
                .replace(/ /g, '')
                .includes(parametro) ||
                (propietariosVuelos[i].propietario.apellidoUsuario || ' ')
                    .trim()
                    .toLocaleLowerCase()
                    .replace(/ /g, '')
                    .includes(parametro) ||
                (propietariosVuelos[i].propietario.aliasUsuario || ' ')
                    .trim()
                    .toLocaleLowerCase()
                    //.replace(/ /g, '')
                    .includes(parametro) ||
                cantidadVuelos.toString() === parametro ||
                vueloDate.getUTCDate().toString() === parametro ||
                vueloDate.getFullYear().toString() === parametro ||
                (vueloDate.getUTCMonth() + 1).toString() === parametro ||
                fechaVueloString.includes(parametro)
            ) {
                const { usuarioId, nombreUsuario, apellidoUsuario, aliasUsuario } = propietariosVuelos[i].propietario; //Descompongo el objeto, extrayendo directamente las variables necesarias
                const ultimoVuelo = propietariosVuelos[i].ultimoVuelo.detalle;
                const cantidadVuelos = propietariosVuelos[i].ultimoVuelo.cantidad;
                listadoPropietarios.push({
                    idPropietario: usuarioId,
                    nombrePropietario: nombreUsuario,
                    apellidoPropietario: apellidoUsuario,
                    aliasPropietario: aliasUsuario,
                    ultimoVuelo,
                    cantidadVuelos,
                });
            }
        }

        return res.json(listadoPropietarios);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Falla en la búsqueda de propietarios, ver logs",
        });
    }
}

module.exports = {
    buscarPropietarios,
};

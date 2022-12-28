//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nanoid = require("nanoid");
const Observacion = require("../model/observacion");
const Marcador = require("../model/marcador");
const Perfil = require("../model/perfil");
const Usuario = require("../model/usuario");
const moment = require("moment");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const observacionPost = async (req = request, res = response) => {
  try {
    const newObservacion = new Observacion({
      observacionId: nanoid.nanoid(),
      fechaObservacion: req.body.fechaObservacion,
      fechaBajaObservacion: null,
      descripcionObservacion: req.body.descripcionObservacion,
      fk_Usuario: req.body.fk_Usuario,
      propietarioObservacion: req.body.propietarioObservacion
    });
    await newObservacion.save();
    for (let i = 0; i < req.body.featureCollection.features.length; i++) {
      const newMarcador = new Marcador({
        marcadorId: nanoid.nanoid(),
        geometryMarcador: req.body.featureCollection.features[i].geometry,
        fk_Observacion: newObservacion.observacionId,
      });
      newMarcador.save();
    }
    res.json(newObservacion);
  } catch (error) {
    console.error(error);
  }
};

const observacionGet = async (req = request, res = response) => {
  try {
    const { fechaDesde, fechaHasta, propietarioObservacion } = req.query;
    console.log(propietarioObservacion);
    const adminId = await Perfil.findOne({
      where: {
        nombrePerfil: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("nombrePerfil")),
          "LIKE",
          "%" + "admin" + "%"
        ),
      },
      attributes: ["perfilId"],
    });

    const admins = await Usuario.findAll({
      where: {
        fk_Perfil: adminId.perfilId,
      },
      attributes: ["usuarioId"],
    });

    let observacionesUsuario = [];

    for (let index = 0; index < admins.length + 1; index++) {
      const admin = admins[index];
      let id;
      if (index < admins.length) {
        id = admin.usuarioId;
      } else {
        id = req.params.usuarioId;
      }
      const observaciones = await Observacion.findAll({
        where: {
          fk_Usuario: id,
          fechaBajaObservacion: null,
          propietarioObservacion: {
            [Op.or]: [propietarioObservacion]
          },
          fechaObservacion: {
            [Op.between]: [fechaDesde, fechaHasta],
          },
        },
        attributes: [
          "observacionId",
          "fechaObservacion",
          "descripcionObservacion",
        ],
      });
      for (let j = 0; j < observaciones.length; j++) {
        const { observacionId, fechaObservacion, descripcionObservacion } =
          observaciones[j];
        const marcador = await Marcador.findAll({
          where: {
            fk_Observacion: observaciones[j].observacionId,
          },
          attributes: ["marcadorId", "geometryMarcador"],
        });
        observacionesUsuario.push({
          observacionId,
          date: fechaObservacion,
          descripcionObservacion,
          marcadores: marcador,
        });
      }
    }
    res.json(observacionesUsuario);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      type: "observacion",
      msg: "No se pudo recuperar el listado de observaciones",
    });
    return;
  }
};

//dar de baja un observación
const bajaObservacion = async (req = request, res = response) => {
  try {
    const observacion = await Observacion.findOne({
      where: {
        observacionId: req.params.observacionId,
      },
    });
    observacion.fechaBajaObservacion = moment(new Date(), "DD-MM-YYYY");
    observacion.save();
    res.json({ msg: "Observación dada de baja" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Se produjo un error al eliminar la observación" })
  }
};

const observacionPut = async (req = request, res = response) => {
  try {
    const updatedObservacion = await Observacion.update(
      {
        descripcionObservacion: req.body.DescripcionObservacion,
        fechaBajaObservacion: null,
        fechaObservacion: null,
      },
      {
        where: {
          observacionId: req.params.observacionId,
        },
      }
    );
    res.json("observación modificada");
  } catch (error) {
    console.error(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  observacionPost,
  observacionGet,
  bajaObservacion,
  observacionPut,
};

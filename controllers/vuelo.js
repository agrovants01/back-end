//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const moment = require("moment");
const nanoid = require("nanoid");
const Vuelo = require("../model/vuelo");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const vueloPost = async (req = request, res = response) => {
  try {
    const newVuelo = new Vuelo({
      vueloId: nanoid.nanoid(),
      cuadroVuelo: req.body.cuadroVuelo,
      aplicacionVuelo: req.body.aplicacionVuelo,
      cultivoVuelo: req.body.cultivoVuelo,
      caldoVuelo: req.body.caldoVuelo,
      totalCaldoVuelo: req.body.totalCaldoVuelo,
      totalH2OVuelo: req.body.totalH2OVuelo,
      pilotoVuelo: req.body.pilotoVuelo,
      asistenteVuelo: req.body.asistenteVuelo,
      fechaVuelo: req.body.fechaVuelo,
      superficieVuelo: req.body.superficieVuelo,
      colorVuelo: req.body.colorVuelo,
      geometryVuelo: req.body.geometryVuelo,
      fk_Usuario: req.body.fk_Usuario,
    });
    await newVuelo.save();
    res.json(newVuelo);
  } catch (error) {
    console.error(error);
  }
};

//obtención de todos los vuelos de un propietario
const vueloGet = async (req = request, res = response) => {
  const { fechaDesde, fechaHasta } = req.query;
  try {
    const vuelos = await Vuelo.findAll({
      where: {
        fk_Usuario: req.params.usuarioId,
        fechaVuelo: {
          [Op.between]: [fechaDesde, fechaHasta]
        }
      },
      attributes: ['vueloId', ['fechaVuelo', 'date'], 'aplicacionVuelo', 'asistenteVuelo', 'cuadroVuelo', 'caldoVuelo', 'colorVuelo', 'cultivoVuelo', 'geometryVuelo', 'pilotoVuelo', 'superficieVuelo', 'totalCaldoVuelo', 'totalH2OVuelo']
    });
    res.json(vuelos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      type: 'vuelo',
      msg: 'No se pudieron recuperar los vuelos del usuario'
    })
  }
};

//dar de baja un vuelo
const bajaVuelo = async (req = request, res = response) => {
  try {
    const vuelo = await Vuelo.findOne({
      where: {
        vueloId: req.params.vueloId,
      },
    });
    vuelo.fechaBajaVuelo = moment(new Date(), "DD-MM-YYYY");
    vuelo.save();
    res.json({ msg: "Vuelo dado de baja" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Se produjo un error al eliminar la el vuelo" })
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  vueloPost,
  vueloGet,
  bajaVuelo,
};

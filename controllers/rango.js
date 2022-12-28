//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nanoid = require("nanoid");
const Rango = require("../model/rango");

const rangoPost = async (req = request, res = response) => {
  try {
    const newRango = new Rango({
      rangoId: nanoid.nanoid(),
      codigoRango: req.body.codigoRango,
      fechaBajaRango: null,
      nombreRango: req.body.nombreRango,
    });
    await newRango.save();
    res.json(newRango);
  } catch (error) {
    console.error(error);
  }
};

const rangoGet = async (req = request, res = response) => {
  try {
    const rangos = await Rango.findAll({
      where: {
        fk_Indice: req.params.indiceId,
      },
    });
    res.json(rangos);
  } catch (error) {
    console.log(error);
  }
};

const destroyRango = async (req = request, res = response) => {
  try {
    const rango = await Rango.destroy({
      where: {
        rangoId: req.params.rangoId,
      },
    });
    res.json({ msg: "rango eliminado" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  rangoPost,
  rangoGet,
  destroyRango,
};

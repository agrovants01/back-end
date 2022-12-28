//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const Agroquimico = require("../model/agroquimico");
const nanoid = require("nanoid");

const agroquimicoPost = async (req = request, res = response) => {
  try {
    const newAgroquimico = new Agroquimico({
      agroquimicoId: nanoid.nanoid(),
      nombreAgroquimico: req.body.nombreAgroquimico,
      dosisAgroquimico: req.body.dosisAgroquimico,
      totalAgroquimico: req.body.totalAgroquimico,
      fk_Vuelo: req.body.fk_Vuelo,
    });
    await newAgroquimico.save();
    res.json(newAgroquimico);
  } catch (error) {
    console.error(error);
  }
};

//dar de baja un agroquimico
const bajaAgroquimico = async (req = request, res = response) => {
  try {
    const agroquimico = await Agroquimico.delete({
      where: {
        agroquimicoId: req.params.agroquimicoId,
      },
    });
    res.json({ msg: "Agroquimico eliminado" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  agroquimicoPost,
  bajaAgroquimico,
};

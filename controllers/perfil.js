//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const moment = require("moment");
const nanoid = require("nanoid");
const Perfil = require("../model/perfil");
const Usuario = require("../model/usuario");

const perfilPost = async (req = request, res = response) => {
  try {
    const newPerfil = new Perfil({
      perfilId: nanoid.nanoid(),
      codigoPerfil: req.body.codigoPerfil,
      fechaBajaPerfil: null,
      nombrePerfil: req.body.nombrePerfil,
    });
    await newPerfil.save();
    res.json(newPerfil);
  } catch (error) {
    console.error(error);
  }
};

const getPerfiles = async (req = request, res = response) => {
  try {
    //Obtengo el listado de todos los perfiles
    const perfiles = await Perfil.findAll({
      where: {
        fechaBajaPerfil: null,
      },
      attributes: ["perfilId", "nombrePerfil"],
    });

    res.json(perfiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "No se ha podido recuperar los perfiles",
    });
  }
};

//dar de baja un perfil
const bajaPerfil = async (req = request, res = response) => {
  try {
    const perfil = await Perfil.findOne({
      where: {
        perfilId: req.params.perfilId,
      },
    });
    perfil.fechaBajaPerfil = moment(new Date(), "DD-MM-YYYY");
    perfil.save();
    const usuarios = await Usuario.findAll({
      where: {
        fk_Perfil: perfil.perfilId,
      },
    });
    for (i in usuarios) {
      usuarios[i].fechaBajaUsuario = moment(new Date(), "DD-MM-YYYY");
      usuarios[i].save();
    }
    res.json({
      msg: "Perfil dada de baja junto con los usuarios que tenian dicho perfil asignado",
    });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  perfilPost,
  getPerfiles,
  bajaPerfil,
};

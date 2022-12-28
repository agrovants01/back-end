//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nanoid = require("nanoid");
const PerfilPermiso = require("../model/perfilPermiso");

const perfilPermisoPost = async (req = request, res = response) => {
  try {
    const newPerfilPermiso = new PerfilPermiso({
      perfilPermisoId: nanoid.nanoid(),
      fk_Perfil: req.body.fk_Perfil,
      fk_Permiso: req.body.fk_Permiso,
      FechaBajaPerfilPermiso: null,
    });
    await newPerfilPermiso.save();
  } catch (error) {
    console.error(error);
  }
};

//dar de baja un perfilPermiso
const bajaPerfilPermiso = async (req = request, res = response) => {
  try {
    const perfilPermiso = await PerfilPermiso.findOne({
      where: {
        perfilPermisoId: req.params.perfilPermisoId,
      },
    });
    perfilPermiso.fechaBajaPerfilPermiso = moment(new Date(), "DD-MM-YYYY");
    perfilPermiso.save();
    res.json({ msg: "PerfilPermiso dado de baja" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  perfilPermisoPost,
  bajaPerfilPermiso,
};

//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nanoid = require("nanoid");
const Permiso = require("../model/permiso");

const permisoPost = async (req = request, res = response) => {
  try {
    const newPermiso = new Permiso({
      permisoId: nanoid.nanoid(),
      NombrePermiso: req.body.NombrePermiso,
      CodigoPermiso: req.body.CodigoPermiso,
      fk_Perfil: req.body.fk_Perfil,
    });
    await newPermiso.save();
    res.json({ permiso: newPermiso });
  } catch (error) {
    console.error(error);
  }
};

//dar de baja un permiso
const bajaPermiso = async (req = request, res = response) => {
  try {
    const permiso = await Permiso.findOne({
      where: {
        permisoId: req.params.permisoId,
      },
    });
    permiso.fechaBajaPermiso = moment(new Date(), "DD-MM-YYYY");
    permiso.save();
    res.json({ msg: "Permiso dado de baja" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  permisoPost,
  bajaPermiso,
};

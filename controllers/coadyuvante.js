//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nanoid = require("nanoid");
const Coadyuvante = require("../model/coadyuvante");

const coadyuvantePost = async (req = request, res = response) => {
  try {
    const newCoadyuvante = new Coadyuvante({
      coadyuvanteId: nanoid.nanoid(),
      nombreCoadyuvante: req.body.nombreCoadyuvante,
      dosisCoadyuvante: req.body.siglaCoadyuvante,
      totalCoadyuvante: req.body.totalCoadyuvante,
      fk_Vuelo: req.body.fk_Vuelo,
    });
    await newCoadyuvante.save();
    res.json(newCoadyuvante);
  } catch (error) {
    console.error(error);
  }
};

//dar de baja un coadyuvante
const bajaCoadyuvante = async (req = request, res = response) => {
  try {
    const coadyuvante = await Coadyuvante.delete({
      where: {
        coadyuvanteId: req.params.coadyuvanteId,
      },
    });
    res.json({ msg: "Coadyuvante eliminado" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  coadyuvantePost,
  bajaCoadyuvante,
};

//Importaciones de librerías y clases necesarias
const { request, response } = require("express");

//dar de baja un marcador
const bajaMarcador = async (req = request, res = response) => {
  try {
    const marcador = await Marcador.delete({
      where: {
        marcadorId: req.params.marcadorId,
      },
    });
    res.json({ msg: "Marcador eliminado" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  bajaMarcador,
};

//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const Analisis = require("../model/analisis");
const Usuario = require("../model/usuario");
const Indice = require("../model/indice");
const Rango = require("../model/rango");
const nanoid = require("nanoid");
const moment = require("moment");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

//creación indice
const analisisPost = async (req = request, res = response) => {
  try {
    //Verificamos que el usuario exista
    const propietario = await Usuario.findOne({
      where: {
        fechaBajaUsuario: null,
        usuarioId: req.body.propietarioAnalisisId,
      },
    });

    if (!propietario) {
      return res.status(404).json({
        msg: "No se encuentra el usuario solicitado",
      });
    }

    //Verificamos que el usuario exista
    const indice = await Indice.findOne({
      where: {
        indiceId: req.body.indiceAnalisisId,
      },
    });

    if (!indice) {
      return res.status(404).json({
        msg: "No se encuentra el índice solicitado",
      });
    }

    //Guardamos el nuevo análisis
    const newAnalisis = new Analisis({
      analisisId: nanoid.nanoid(),
      fechaAnalisis: moment(new Date(), "DD-MM-YYYY"),
      imagenAnalisis: req.body.imagenAnalisis,
      fk_Usuario: req.body.propietarioAnalisis,
      fk_Indice: req.body.indiceAnalisisId,
    });
    await newAnalisis.save();
    res.json(newAnalisis);
  } catch (error) {
    console.error(error);
  }
};

//obtención de todos los análisis de un propietario de una indice en particular
const analisisGet = async (req = request, res = response) => {
  try {
    console.log(req.params);
    const analisis = await Analisis.findAll({
      where: {
        fk_Usuario: req.params.usuarioId,
        fk_Indice: req.params.indiceId,
      },
    });
    res.json(analisis);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "No se pudo recuperar el listado de análisis del usuario"
    })
  }
};


const getAnalisisUsuario = async (req = request, res = response) => {
  const { fechaDesde, fechaHasta } = req.query;
  try {
    const analisis = await Analisis.findAll({
      include: [
        {
          model: Indice,
          on: {
            fk_Indice: sequelize.where(sequelize.col("Analisis.fk_Indice"), "=", sequelize.col("Indice.indiceId")),
          },
          attributes: ['indiceId']
        }
      ],
      where: {
        fk_Usuario: req.params.usuarioId,
        fechaAnalisis: {
          [Op.between]: [fechaDesde, fechaHasta]
        }
      },
      attributes: ['fechaAnalisis', 'analisisId', 'imagenAnalisis'],
    });

    let indices = await Indice.findAll({
      attributes: ['siglasIndice', 'nombreIndice', 'indiceId']
    })

    let analisisFull = [];

    for (i in indices) {
      for (j in analisis) {
        console.log(analisis[j].fechaAnalisis);
        if (indices[i].indiceId === analisis[j].Indice.indiceId) {
          const rangos = await Rango.findAll({
            where: {
              fk_Indice: indices[i].indiceId
            },
            attributes: ['colorRango', 'desdeRango', 'hastaRango']
          })

          analisisFull.push({
            analisisId: analisis[j].analisisId,
            date: analisis[j].fechaAnalisis,
            imagenAnalisis: analisis[j].imagenAnalisis,
            indice: {
              nombreIndice: indices[i].nombreIndice,
              siglasIndice: indices[i].siglasIndice,
              rangos
            }
          });
        }
      }
    }

    res.json(analisisFull);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      type: 'analisis',
      msg: "No se pudo recuperar el listado de análisis del usuario"
    })
  }
}


//dar de baja un análisis
const bajaAnalisis = async (req = request, res = response) => {
  try {
    const analisis = await Analisis.findOne({
      where: {
        analisisId: req.params.analisisId,
      },
    });
    analisis.fechaBajaAnalisis = moment(new Date(), "DD-MM-YYYY");
    analisis.save();
    res.json({ msg: "Análisis dado de baja" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "No se pudo eliminar el análisis del usuario"
    })
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  analisisPost,
  analisisGet,
  getAnalisisUsuario,
  bajaAnalisis,
};

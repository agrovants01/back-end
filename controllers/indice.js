//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const Indice = require("../model/indice");
const Rango = require("../model/rango");
const nanoid = require("nanoid");
const Vuelo = require("../model/vuelo");
const Observacion = require("../model/observacion");
const Analisis = require("../model/analisis");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

//creación indice
const indicePost = async (req = request, res = response) => {
  try {
    const newIndice = new Indice({
      indiceId: nanoid.nanoid(),
      nombreIndice: req.body.nombreIndice,
      siglasIndice: req.body.siglasIndice,
      bandasIndice: req.body.bandasIndice,
    });
    await newIndice.save();
    return res.json(newIndice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la creación de índices, ver logs",
    });
  }
};

//getAll indices con sus rangos
const indicesGet = async (req = request, res = response) => {
  try {
    let indices = await Indice.findAll();
    let indicesGet = [];
    for (const i in indices) {
      const referencia = await Rango.findAll({
        where: {
          fk_Indice: indices[i].indiceId,
        },
      });
      const { indiceId, nombreIndice, siglasIndice, bandasIndice } = indices[i];
      indicesGet.push({
        indiceId,
        nombreIndice,
        siglasIndice,
        bandasIndice,
        referencia,
      });
    }
    res.json(indicesGet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la búsqueda de índices, ver logs",
    });
  }
};

//destroy indice
const indiceDelete = async (req = request, res = response) => {
  try {
    await Indice.destroy({
      where: {
        indiceId: req.params.indiceId,
      },
      returning: true,
      plain: true,
    });

    const rangos = await Rango.findAll({
      where: {
        fk_Indice: req.params.indiceId,
      },
    });

    for (i in rangos) {
      await Rango.destroy({
        where: {
          fk_Indice: req.params.indiceId,
        },
      });
    }

    res.json("índice eliminado satisfactoriamente");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la eliminación de índices, ver logs",
    });
  }
};

const j = function () {
  var newman = require("newman"); // require Newman in your project

  // call newman.run to pass `options` object and wait for callback
  newman.run(
    {
      collection: require("../Agrovants.test.newman.json"),
      reporters: "cli",
    },
    function (err) {
      if (err) {
        throw err;
      }
      console.log("collection run complete!");
    }
  );
};

const obtenerFecha = function (req) {
  // Date formatting
  const fecha = new Date(req.body.fecha);
  const fechaAño = fecha.getFullYear();
  const fechaMes = fecha.getMonth() + 1;
  const ultimoDia = new Date(fechaAño, fechaMes, 0).getDate();
  const semana = req.body.semana;
  let periodo;
  switch (semana) {
    case "s1":
      periodo = [`${fechaAño}-${fechaMes}-01`, `${fechaAño}-${fechaMes}-07`];
      break;
    case "s2":
      periodo = [`${fechaAño}-${fechaMes}-08`, `${fechaAño}-${fechaMes}-14`];
      break;
    case "s3":
      periodo = [`${fechaAño}-${fechaMes}-15`, `${fechaAño}-${fechaMes}-21`];
      break;
    case "s4":
      periodo = [
        `${fechaAño}-${fechaMes}-22`,
        `${fechaAño}-${fechaMes}-${ultimoDia}`,
      ];
      break;
  }
  return periodo;
};

//ponerlo en su respectivo controlador
const google = async (req = request, res = response) => {
  try {
    //obtengo el periodo
    const periodo = obtenerFecha(req);

    // busco la indice y rangos
    const indice = await Indice.findOne({
      where: {
        indiceId: req.body.indiceId,
      },
    });

    const rango = await Rango.findAll({
      where: {
        fk_Indice: indice.indiceId,
      },
    });
    // Require client library and private key.
    var ee = require("@google/earthengine");
    var privateKey = require("../key/privatekey.json");

    // Initialize client library and run analysis.
    var runAnalysis = function () {
      ee.initialize(null, null, function () {
        try {
          /**  Google Earth Engine script **/

          // Parámetros solicitados
          // const coord = req.body.coord.coordenadas
          // const capa2 = indice.siglasIndice
          const dates = periodo;
          const gj = req.body.featureCollectionRequest;

          // Formateo del polígono
          const featureCollection = ee.FeatureCollection(gj);
          const geometry = featureCollection.geometry();

          var get_dates = function (collection, month, year, bounds) {
            var filtered = collection
              .filter(ee.Filter.calendarRange(year, year, "year"))
              .filter(ee.Filter.calendarRange(month, month, "month"))
              .filterBounds(bounds);

            return ee.List(
              filtered.toList(filtered.size()).map(function (img) {
                return ee.Image(img).date().format();
              })
            );
          };

          //devuelve las fechas en las que el satélite devuelve que hubo análisis
          // var dates2 = get_dates(ee.ImageCollection('COPERNICUS/S2'), 12, 2021, geometry);
          // console.log(dates2.getInfo());
          //

          const bandas = indice.bandasIndice.split(",");

          // Indice
          const appLayer = function (i) {
            var ndvi = i.normalizedDifference(bandas);
            i = i.addBands(ndvi.rename(indice.siglasIndice));
            return i.clip(geometry);
          };

          //cargo los valores desde y hasta y saco el mínimo y máximo
          let rangosDesde = new Array();
          let rangosHasta = new Array();
          //cargo la paleta de colores de la indice
          let paleta = new Array();
          for (let d = 0; d < rango.length; d++) {
            rangosDesde.push(rango[d].desdeRango);
            rangosHasta.push(rango[d].hastaRango);
            paleta.push(rango[d].colorRango);
          }
          let min = Math.min(...rangosDesde);
          let max = Math.max(...rangosHasta);

          //parámetros de la indice
          const paramsLayer = {
            bands: [indice.siglasIndice],
            max: max,
            min: min,
            palette: paleta,
          };

          // Definir colección de imágenes
          var image = new ee.ImageCollection("COPERNICUS/S2")
            .filterBounds(geometry)
            .filterDate(dates[0], dates[1])
            .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "Less_than", 30)
            .map(appLayer);

          // Obtener primer elemento de la colección
          var imageList = image.toList(image.size());
          var firstImage = imageList.get(0);
          var image1 = ee.Image(firstImage);

          // Obtener url
          var url = image1
            .visualize(paramsLayer)
            .getThumbURL({ scale: 1, format: "png" });
          // .getDownloadURL({ scale: 5, region: geometry }) //to download

          console.log(url);
          res.json({ url: url });
        } catch (e) {
          console.error("Initialization error: " + e);
          res.json(e);
        }
      });
    };

    // Authenticate using a service account.
    ee.data.authenticateViaPrivateKey(privateKey, runAnalysis, function (e) {
      console.error("Authentication error: " + e);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la obtención de layer, ver logs",
    });
  }
};

const indiceFullPost = async (req = request, res = response) => {
  try {
    const newIndice = new Indice({
      indiceId: nanoid.nanoid(),
      nombreIndice: req.body.nombreIndice,
      siglasIndice: req.body.siglasIndice,
      bandasIndice: req.body.bandasIndice,
    });
    await newIndice.save(); //sino guardo inmediatamente, no puedo utilizar sus atributos(fk_capa) en los objetos rango
    let fkIndice = newIndice.indiceId;
    //solo para devolverlo por el res
    let rangos = [];
    let referencias = req.body.referencias;
    for (let i = 0; i < referencias.length; i++) {
      const newRango = new Rango({
        rangoId: nanoid.nanoid(),
        colorRango: referencias[i].colorRango,
        desdeRango: referencias[i].desdeRango,
        hastaRango: referencias[i].hastaRango,
        fk_Indice: fkIndice,
      });

      await newRango.save();
      rangos.push(newRango);
    }

    res.json({ newIndice, rangos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la creación de índices, ver logs",
    });
  }
};

//editar índices y rango
const indicePutIndice = async (req = request, res = response) => {
  try {
    //Actualizamos los datos del indice
    const indice = await Indice.update(
      {
        nombreIndice: req.body.nombreIndice,
        siglasIndice: req.body.siglasIndice,
        bandasIndice: req.body.bandasIndice,
      },
      {
        where: {
          indiceId: req.body.indiceId,
        },
      }
    );
    const rangos = await Rango.findAll({
      where: {
        fk_Indice: req.body.indiceId,
      },
    });

    const rangosActualesId = [...rangos].map(
      (rangoActual) => rangoActual.rangoId
    ); //Extraemos el id de cada rango actual
    let rangosAEliminarId = [];

    const rangosBody = req.body.referencias;

    let rangosNuevos = [...rangosBody].filter(
      (rangoActual) => rangoActual.rangoId === null
    );
    let rangosAModificar = [...rangosBody].filter(
      (rangoActual) => rangoActual.rangoId !== null
    );
    let rangosAModificarId = [...rangosAModificar].map(
      (rangoModificar) => rangoModificar.rangoId
    );

    //Obtenemos los rangos que serán eliminados
    for (i in rangosActualesId) {
      if (rangosAModificarId.indexOf(rangosActualesId[i]) < 0) {
        rangosAEliminarId.push(rangosActualesId[i]);
      }
    }

    for (i in [...rangosAModificar]) {
      const rangoAModificar = rangosAModificar[i];

      //Editamos los actuales

      await Rango.update(
        {
          colorRango: rangoAModificar.colorRango,
          desdeRango: rangoAModificar.desdeRango,
          hastaRango: rangoAModificar.hastaRango,
        },
        {
          where: {
            fk_Indice: req.body.indiceId,
            rangoId: rangoAModificar.rangoId,
          },
        }
      );
    }

    //Eliminamos los rangos que no están en el body
    for (i in [...rangosAEliminarId]) {
      await Rango.destroy({
        where: {
          rangoId: rangosAEliminarId[i],
        },
      });
    }

    for (i in [...rangosNuevos]) {
      let nuevoRango = rangosNuevos[i];
      //Creamos los nuevos
      nuevoRango.rangoId = nanoid.nanoid();
      nuevoRango.fk_Indice = req.body.indiceId;
      await Rango.create(nuevoRango); //Creamos los nuevos
    }
    res.json(true);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la creación de índices, ver logs",
    });
  }
};

//se obtienen todos los vuelos, análisis y observaciones
const getFull = async (req = request, res = response) => {
  try {
    const vuelos = await Vuelo.findAll({
      where: {
        fk_Usuario: req.params.usuarioId,
      },
    });
    const observaciones = await Observacion.findAll({
      where: {
        fk_Usuario: req.params.usuarioId,
      },
    });
    const analisis = await Analisis.findAll({
      where: {
        fk_Usuario: req.params.usuarioId,
      },
    });
    res.json({
      vuelos: vuelos,
      observaciones: observaciones,
      analisis: analisis,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Falla en la obtención de índices, ver logs",
    });
  }
};

const indiceAdminGET = async (req = request, res = response) => {
  //Capturamos el valor de búsqueda
  const parametroBusqueda = req.query.q.trim().toLocaleLowerCase();
  const order = [
    req.query.sort || "nombreIndice",
    req.query.order.toUpperCase() || "ASC",
  ];
  const offset = req.query.page || 0;
  const limit = req.query.limit || 100;

  try {
    //Obtenemos todos los usuarios
    const indices = await Indice.findAndCountAll({
      attributes: ["indiceId", "nombreIndice", "siglasIndice", "bandasIndice"],
      where: {
        //fechaBajaIndice: null, //TODO: Agregar fecha de bajad de indice
        [Op.or]: [
          {
            nombreIndice: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("nombreIndice")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
          {
            siglasIndice: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("siglasIndice")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
          {
            bandasIndice: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("bandasIndice")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          }
        ],
      },
      order: [order],
      limit: limit,
      offset: offset * limit,
    });

    return res.json(indices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la búsqueda de índices, ver logs",
    });
  }
};

//dar de baja un indice
const bajaIndice = async (req = request, res = response) => {
  try {
    const rangos = await Rango.findAll({
      where: {
        fk_Indice: req.params.indiceId,
      },
    });
    for (i in rangos) {
      await rangos[i].destroy();
    }
    const indice = await Indice.destroy({
      where: {
        indiceId: req.params.indiceId,
      },
    });
    res.json({ msg: "Indice eliminado con sus rangos" });
  } catch (error) {
    console.log(error);
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  indicePost,
  indiceDelete,
  indicesGet,
  j,
  google,
  indiceFullPost,
  getFull,
  indiceAdminGET,
  indicePutIndice,
  bajaIndice,
};

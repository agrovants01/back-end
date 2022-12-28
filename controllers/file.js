const { request, response } = require("express");
const nanoid = require("nanoid");
const Agroquimico = require("../model/agroquimico");
const Coadyuvante = require("../model/coadyuvante");
const Usuario = require("../model/usuario");
const Vuelo = require("../model/vuelo");
const { Op } = require("sequelize");
const Perfil = require("../model/perfil");

const ExisteUsuario = async (req = request, res = response) => {
  //array que contiene los usuarios que existen
  let noExisteUsuario = [];
  for (let i = 0; i < req.body.propietarios.length; i++) {
    //transformo a minúscula el body
    let propietariosLower = req.body.propietarios[i].toLowerCase();
    //transformo a mayúscula el body
    let propietariosUpper = req.body.propietarios[i].toUpperCase();
    console.log(
      "upper and lower",
      propietariosLower,
      propietariosUpper,
      req.body.propietarios[i]
    );
    const usuario = await Usuario.findOne({
      where: {
        aliasUsuario: {
          [Op.iLike]: req.body.propietarios[i],
        },
      },
    });
    if (!usuario) {
      noExisteUsuario.push(req.body.propietarios[i]);
    }
  }
  res.json(noExisteUsuario);
};

const postFull = async (req = request, res = response) => {
  try {
    for (let i = 0; i < req.body.features.length; i++) {
      //Verifico si existe el propietario, sino consulto al usuario si desea crearlo
      const usuarioExiste = await Usuario.findOne({
        where: {
          aliasUsuario: {
            [Op.iLike]: req.body.features[i].properties.propietario,
          },
        },
      });

      //Busco el id del perfil propietario
      const propietario = await Perfil.findOne({
        where: { nombrePerfil: "PROPIETARIO" || "Propietario" || "propietario" },
      });
      //guardo el id del usuario, ya que: puede existir o se debe haber creado
      let idUsuario;
      if (usuarioExiste) {
        idUsuario = usuarioExiste.usuarioId;
      } else {
        const newUsuario = new Usuario({
          usuarioId: nanoid.nanoid(),
          nombreUsuario: "",
          apellidoUsuario: "",
          emailUsuario: "",
          contraseniaUsuario: "",
          telefonoUsuario: "",
          aliasUsuario: req.body.features[i].properties.propietario,
          fk_Perfil: propietario.perfilId, //id de propietario
        });
        await newUsuario.save();
        idUsuario = newUsuario.usuarioId;
      }

      //calculo el caldo total
      let totalCaldo = 0;
      for (let j = 0; j < req.body.features.length; j++) {
        totalCaldo += req.body.features[j].properties.caldo_lts;
      }

      //Genero color aleatorio
      function randomColor() {
        const h = Math.floor(Math.random() * 360);
        const s = 100;
        let l = 50;
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      }

      const newVuelo = new Vuelo({
        vueloId: nanoid.nanoid(),
        cuadroVuelo: req.body.features[i].properties.cuadro,
        aplicacionVuelo: req.body.features[i].properties.aplicacion,
        cultivoVuelo: req.body.features[i].properties.cultivo,
        caldoVuelo: req.body.features[i].properties.caldo_lts,
        totalCaldoVuelo: totalCaldo, //calculado
        totalH2OVuelo: req.body.features[i].properties.caldo_lts, //modificar ???quién manda esto???
        pilotoVuelo: req.body.features[i].properties.piloto,
        asistenteVuelo: req.body.features[i].properties.asistente,
        fechaVuelo: req.body.features[i].properties.fecha,
        superficieVuelo: req.body.features[i].properties.Area,
        colorVuelo: randomColor(),
        geometryVuelo: req.body.features[i].geometry,
        fk_Usuario: idUsuario, //
      });

      await newVuelo.save();

      //variables agroquímicos
      let cantAgroquimicos = 0;
      let nombreAgroquimicos = [];
      let dosisAgroquimicos = [];
      //variables coadyuvantes
      let cantCoadyuvantes = 0;
      let nombreCoadyuvantes = [];
      let dosisCoadyuvantes = [];

      //recorro los elementos para sacar los nombres
      Object.entries(req.body.features[i].properties).forEach(
        ([key, value]) => {
          if (key.startsWith("agq") && value != null) {
            cantAgroquimicos += 1;
            nombreAgroquimicos.push(value);
          } else if (key.startsWith("coad") && value != null) {
            cantCoadyuvantes += 1;
            nombreCoadyuvantes.push(value);
          }
        }
      );

      //recorro los elementos para sacar las dosis
      Object.entries(req.body.features[i].properties).forEach(
        ([key, value]) => {
          if (key.startsWith("dosisagq") && value != 0) {
            dosisAgroquimicos.push(value);
          } else if (key.startsWith("dosiscoad") && value != 0) {
            dosisCoadyuvantes.push(value);
          }
        }
      );

      //creación de las instancias agroquímicos
      for (let j = 0; j < cantAgroquimicos; j++) {
        const newAgroquimico = new Agroquimico({
          agroquimicoId: nanoid.nanoid(),
          nombreAgroquimico: nombreAgroquimicos[j],
          dosisAgroquimico: dosisAgroquimicos[j],
          totalAgroquimico: "0", //dato faltante en el json
          fk_Vuelo: newVuelo.vueloId,
        });
        await newAgroquimico.save();
      }

      //creación de las instancias coadyuvantes
      for (let k = 0; k < cantCoadyuvantes; k++) {
        const newCoadyuvante = new Coadyuvante({
          coadyuvanteId: nanoid.nanoid(),
          nombreCoadyuvante: nombreCoadyuvantes[k],
          dosisCoadyuvante: dosisCoadyuvantes[k],
          totalCoadyuvante: "0", //dato faltante en el json
          fk_Vuelo: newVuelo.vueloId,
        });
        await newCoadyuvante.save();
      }
    }
    res.json({ msg: "ok" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  postFull,
  ExisteUsuario,
};

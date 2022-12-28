/* trae todos los vuelos   */
const { request, response } = require("express");
const Vuelo = require("../model/vuelo");
const { Op } = require("sequelize");
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const Usuario = require("../model/usuario");
const Agroquimico = require("../model/agroquimico");
const Coadyuvante = require("../model/coadyuvante");
const moment = require("moment");

//Trae todos los vuelos de un usuario entre un rango de fechas
const reporteVuelo = async (req = request, res = response) => {
  try {
    const usuario = await Usuario.findOne({
      where: {
        usuarioId: req.body.usuarioId,
      },
    });
    const vuelo = await Vuelo.findAll({
      where: {
        fechaVuelo: {
          [Op.gte]: req.body.fechaDesde,
          [Op.lte]: req.body.fechaHasta,
        },
        fk_Usuario: usuario.usuarioId,
      },
    });

    res.json(vuelo);
  } catch (error) {
    console.log(error);
  }
};

const reporte = async (req = request, res = response) => {
  try {
    //búsqueda de la información
    //el front devuelve un array de id (de los vuelos)
    let VuelosReporte = [];
    //busco cuántos agroquímicos tiene cada vuelo y elijo el de mayor cantidad
    let cantAgroq = 0;
    let columnasReporte = [];
    /* let dtoVuelo = []; */
    let sizeColumn = [];
    let user;

    for (let i = 0; i < req.body.vuelos.length; i++) {
      let dtoVuelo = [];
      const vuelo = await Vuelo.findOne({
        where: {
          vueloId: req.body.vuelos[i],
        },
      });
      const usuario = await Usuario.findOne({
        where: {
          usuarioId: vuelo.fk_Usuario,
        },
      });
      user = usuario;
      const agroq = await Agroquimico.findAll({
        where: {
          fk_Vuelo: vuelo.vueloId,
        },
      });
      const coad = await Coadyuvante.findAll({
        where: {
          fk_Vuelo: vuelo.vueloId,
        },
      });
      //chequeo la cantidad de agroquimicos de los vuelos
      if (agroq.length > cantAgroq) {
        cantAgroq = agroq.length;
        let agroqColumna = 0;

        //seteo los headers en el array
        /* primera parte */
        columnasReporte.push(
          "propietario",
          "cuadro",
          "cultivo",
          "aplicación",
          "fecha aplicación",
          "superficie"
        );
        /* segunda parte */
        for (let i = 0; i < agroq.length; i++) {
          columnasReporte.push("agq " + (i + 1), "total agq " + (i + 1));
          agroqColumna += 1;
        }
        /* tercera parte */
        columnasReporte.push(
          "coad",
          "total coad lts",
          "total h2O lts",
          "total caldo"
        );
        //array para setear el tamaño de las columnas en la tabla
        const p = columnasReporte.length;

        for (let j = 0; j < p; j++) {
          sizeColumn.push(45);
        }

        //seteo los valores de las filas
        //GUARDO LOS TOTAL CALDO PORQUE NO LOS TOMA DESDE VUELOS
        let caldo = vuelo.totalCaldoVuelo;
        //me fijo si el usuario tiene nombre y apellido, sino le asigno el alias
        let propietario;
        if (
          (usuario.nombreUsuario || usuario.apellidoUsuario) === "" ||
          (usuario.nombreUsuario || usuario.apellidoUsuario) === undefined ||
          (usuario.nombreUsuario || usuario.apellidoUsuario) === null
        ) {
          propietario = usuario.aliasUsuario;
        } else {
          propietario = usuario.nombreUsuario + " " + usuario.apellidoUsuario;
        }

        /* primera parte */
        dtoVuelo.push(
          (nombrePropietario = propietario || "-"),
          (cuadroVuelo = vuelo.cuadroVuelo || "-"),
          (cultivoVuelo = vuelo.cultivoVuelo || "-"),
          (aplicacionVuelo = vuelo.aplicacionVuelo || "-"),
          (fechaVuelo = vuelo.fechaVuelo || "-"),
          (superficieVuelo = vuelo.superficieVuelo || "-")
        );
        /* segunda parte */
        for (let i = 0; i < agroq.length; i++) {
          dtoVuelo.push(
            agroq[i].nombreAgroquimico +
              " " +
              agroq[i].dosisAgroquimico +
              " " +
              "lts/ha" || "-",
            agroq[i].totalAgroquimico || "-"
          );
          agroqColumna += 1;
        }
        /* tercera parte */
        dtoVuelo.push(
          (coad1 = coad[0].nombreCoadyuvante + " " + "lts/ha" || "-"),
          (totalCoad = coad[0].totalCoadyuvante + " " + "lts/ha" || "-"),
          (totalH2O = vuelo.totalH2OVuelo || "-"),
          (totalCaldoVuelo = caldo || "-")
        );
        VuelosReporte.push(dtoVuelo);
      } else if (agroq.length <= cantAgroq) {
        let agroqColumna = 0;

        //seteo los valores de las filas
        //GUARDO LOS TOTAL CALDO PORQUE NO LOS TOMA DESDE VUELOS
        let caldo = vuelo.totalCaldoVuelo;
        //me fijo si el usuario tiene nombre y apellido, sino le asigno el alias
        let propietario;
        if (
          (usuario.nombreUsuario || usuario.apellidoUsuario) === "" ||
          (usuario.nombreUsuario || usuario.apellidoUsuario) === undefined ||
          (usuario.nombreUsuario || usuario.apellidoUsuario) === null
        ) {
          propietario = usuario.aliasUsuario;
        } else {
          propietario = usuario.nombreUsuario + " " + usuario.apellidoUsuario;
        }

        /* primera parte */
        dtoVuelo.push(
          (nombrePropietario = propietario || "-"),
          (cuadroVuelo = vuelo.cuadroVuelo || "-"),
          (cultivoVuelo = vuelo.cultivoVuelo || "-"),
          (aplicacionVuelo = vuelo.aplicacionVuelo || "-"),
          (fechaVuelo = vuelo.fechaVuelo || "-"),
          (superficieVuelo = vuelo.superficieVuelo || "-")
        );
        /* segunda parte */
        for (let i = 0; i < cantAgroq; i++) {
          if (agroq[i] == undefined) {
            dtoVuelo.push("-", "-");
          } else {
            dtoVuelo.push(
              (agroq[i].nombreAgroquimico || "-") +
                " " +
                (agroq[i].dosisAgroquimico || "-") +
                " " +
                "lts/ha" || "-",
              agroq[i].totalAgroquimico || "-"
            );
            agroqColumna += 1;
          }
        }
        /* tercera parte */
        dtoVuelo.push(
          (coad1 = coad[0].nombreCoadyuvante + " " + "lts/ha" || "-"),
          (totalCoad = coad[0].totalCoadyuvante + " " + "lts/ha" || "-"),
          (totalH2O = vuelo.totalH2OVuelo || "-"),
          (totalCaldoVuelo = caldo || "-")
        );
        VuelosReporte.push(dtoVuelo);
      }
    }
    let doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 25,
    });
    const formattedDate = moment().format("YYYY-MM-DD");
    let fe = fs.createWriteStream("reports/Agrovants" + formattedDate + ".pdf");
    //allow to manage the time between read and write information, you don´t need to use delay ;)
    doc.pipe(res);
    doc.pipe(fe);
    // Scale proprotionally to the specified width
    doc.image(process.env.IMAGES, 20, 30, {
      scale: 0.06,
    });
    let titulo = "Planilla de Buenas Prácticas Agrícolas";
    let subtitulo;
    if (
      (user.nombreUsuario || user.apellidoUsuario) === "" ||
      (user.nombreUsuario || user.apellidoUsuario) === undefined ||
      (user.nombreUsuario || user.apellidoUsuario) === null
    ) {
      subtitulo = user.aliasUsuario;
    } else {
      subtitulo = user.nombreUsuario + " " + user.apellidoUsuario;
    }

    doc.text(" ");
    doc.font("Helvetica-Bold").text(`${titulo}`, {
      width: doc.page.width,
      align: "center",
    });
    doc.text(" ");

    doc.text(`${subtitulo}`, {
      width: doc.page.width,
      align: "center",
    });
    const table = {
      headers: columnasReporte,
      rows: VuelosReporte,
    };

    doc.text(" ");
    doc.text(" ");
    doc.text(" ");

    doc.table(table, {
      // A4 595.28 x 841.89 (portrait) (about width sizes)
      width: 290,
      columnsSize: sizeColumn,
    });
    doc.end();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  reporteVuelo,
  reporte,
};

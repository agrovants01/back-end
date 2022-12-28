//Importaciones necesarias
const sequelize = require("../database/config");
const Sequelize = require("sequelize");

const Observacion = sequelize.define(
  "Observacion",
  {
    // atributos
    observacionId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true, //se establece que es la clave primaria de la tabla
      unique: true,
    },
    fechaBajaObservacion: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    descripcionObservacion: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fechaObservacion: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    propietarioObservacion: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
/* al colocar force:true, vuelve a crear la tabla a pesar de que ya esté creada, es decir, la tabla se elimina
y se vuelve a crear*/

async () => {
  await Observacion.sync({ force: false });
};

module.exports = Observacion;

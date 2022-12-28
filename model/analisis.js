//Importaciones necesarias
const sequelize = require("../database/config");
const Sequelize = require("sequelize");

const Analisis = sequelize.define(
  "Analisis",
  {
    // atributos
    analisisId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true, //se establece que es la clave primaria de la tabla
      unique: true,
    },
    fechaAnalisis: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    imagenAnalisis: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fechaBajaAnalisis: {
      type: Sequelize.DATEONLY,
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
  await Analisis.sync({ force: false });
};

module.exports = Analisis;

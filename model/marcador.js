//Importaciones necesarias
const sequelize = require("../database/config");
const Sequelize = require("sequelize");

const Marcador = sequelize.define(
  "Marcador",
  {
    // atributos
    marcadorId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true, //se establece que es la clave primaria de la tabla
      unique: true,
    },
    geometryMarcador: {
      type: Sequelize.DataTypes.GEOMETRY,
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
  await Marcador.sync({ force: false });
};

module.exports = Marcador;

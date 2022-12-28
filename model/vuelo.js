//Importaciones necesarias
const sequelize = require("../database/config");
const Sequelize = require("sequelize");

const Vuelo = sequelize.define(
  "Vuelo",
  {
    // atributos
    vueloId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true, //se establece que es la clave primaria de la tabla
      unique: true,
    },
    cuadroVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    aplicacionVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cultivoVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    caldoVuelo: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    totalCaldoVuelo: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    totalH2OVuelo: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    pilotoVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    asistenteVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fechaVuelo: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    superficieVuelo: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    colorVuelo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    geometryVuelo: {
      type: Sequelize.GEOMETRY,
      allowNull: false,
    },
    fechaBajaVuelo: {
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
  await Vuelo.sync({ force: false });
};

module.exports = Vuelo;

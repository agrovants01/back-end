
const Sequelize = require('sequelize');
const associations = require('../associations');

// Database
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {
  dialect: 'postgres',
  charset: 'utf8',
  collate: 'utf8_general_ci',
  protocol: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
    useUTC: false,
    ssl: {
      //require: true,
      rejectUnauthorized: false
    }
  },
  timezone: 'America/Argentina/Mendoza'
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Se ha establecido la conexión satisfactoriamiente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos', err);
  });


console.log('Base de datos online');

module.exports = sequelize;
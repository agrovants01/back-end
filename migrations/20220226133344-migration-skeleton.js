'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /* queryInterface.addColumn(
       'Marcador',
       'fk_Observacion',
       Sequelize.STRING
     )*/

    /* queryInterface.addColumn(
       'Observacion',
       'propietarioObservacion',
       Sequelize.STRING
     )*/

    /*queryInterface.addColumn(
      'Observacion',
      'fechaObservacion',
      Sequelize.DATEONLY
    )*/
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    /*queryInterface.dropColumn(
      'Observacion',
      'fechaObservacion',
      Sequelize.DATE
    )*/

  }
};

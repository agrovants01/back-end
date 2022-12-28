//Importaciones necesarias de los clases a utilizar
const Usuario = require('../model/usuario');


const emailExiste = async (correo = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ where: { emailUsuario: correo } });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado`);
    }
}

const existeUsuarioPorEmail = async (correo = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ where: { emailUsuario: correo } });
    if (existeEmail === null || existeEmail.emailUsuario !== correo) {
        throw new Error(`El correo: ${correo} no existe`);
    }
}



//exportación de los métodos utilizados
module.exports = {
    emailExiste,
    existeUsuarioPorEmail

}
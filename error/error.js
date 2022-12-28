function noVacio(campo) {
    const c = campo
    return ('el campo ' + c + ' es obligatorio')
};

function longitud(campo) {
    const c = campo
    return ('el campo ' + c + ' debe contener entre 2 y 50 caracteres')
};

function longitudDescripcion(campo) {
    const c = campo
    return ('el campo ' + c + ' debe contener entre 1 y 150 caracteres')
};

function longitudMayor(campo, caracteres) {
    const c = campo
    return ('el campo ' + c + ' debe tener más de ' + caracteres + ' caracteres')
};

function CaracteresValidos(campo) {
    const c = campo
    return ('el campo ' + c + ' sólo puede contener caracteres alfanuméricos y espacios ')
};

function formatoEmail(campo) {
    const c = campo
    return ('el formato del campo ' + c + ' no es válido')
};

function formatoFecha(campo) {
    const c = campo
    return ('el formato del campo ' + c + 'debe ser dd-mm-yyyy en números')
};

function numero(campo) {
    const c = campo
    return ('el formato del campo ' + c + 'solo puede contener números')
};

//const noVacios = 'La dirección del campo es obligatoria';

module.exports = {
    noVacio,
    longitud,
    longitudMayor,
    CaracteresValidos,
    formatoEmail,
    formatoFecha,
    numero,
    longitudDescripcion

}
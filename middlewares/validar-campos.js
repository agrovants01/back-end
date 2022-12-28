//importación necesaria
const { validationResult } = require('express-validator');

//método que permite validar si un campo no está vacío
const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

//exportación necesaria
module.exports = {
    validarCampos
}


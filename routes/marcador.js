const { Router } = require("express");
const { bajaMarcador } = require("../controllers/marcador");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.delete("bajaMarcador/:marcadorId", [validarJWT], bajaMarcador);

module.exports = router;

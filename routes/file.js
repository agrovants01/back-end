const { Router } = require("express");
const { postFull, ExisteUsuario } = require("../controllers/file");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT], postFull);

router.post("/getUsuarios", [validarJWT], ExisteUsuario);

module.exports = router;

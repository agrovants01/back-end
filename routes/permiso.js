const { Router } = require("express");
const {} = require("../controllers/permiso");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT]);

module.exports = router;

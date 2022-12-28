const { Router } = require("express");
const { vueloPost, vueloGet, bajaVuelo } = require("../controllers/vuelo");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT], vueloPost);

router.get("/:usuarioId", [validarJWT], vueloGet);

router.put("/bajaVuelo/:vueloId", [validarJWT], bajaVuelo);

module.exports = router;

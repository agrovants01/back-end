const { Router } = require("express");
const {
  analisisPost,
  analisisGet,
  bajaAnalisis,
  getAnalisisUsuario,
} = require("../controllers/analisis");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get("/usuario/:usuarioId/", [validarJWT], getAnalisisUsuario);

router.post("/", [validarJWT], analisisPost);

router.put("/bajaAnalisis/:analisisId", [validarJWT], bajaAnalisis);

router.get("/:usuarioId/:indiceId", [validarJWT], analisisGet);

module.exports = router;

const { Router } = require("express");
const {
  observacionPost,
  observacionGet,
  bajaObservacion,
  observacionPut,
} = require("../controllers/observacion");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT], observacionPost);

router.get("/:usuarioId", [validarJWT], observacionGet);

router.put("/bajaObservacion/:observacionId", [validarJWT], bajaObservacion);

router.put(
  "/modificarObservacion/:observacionId",
  [validarJWT],
  observacionPut
);

module.exports = router;

const { Router } = require("express");
const { rangoPost, rangoGet, destroyRango } = require("../controllers/rango");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/",
  [validarJWT],
  rangoPost
); /* no se utiliza, ya que está en el full, con el índice */

router.get("/:indiceId", [validarJWT], rangoGet);

router.delete("/destroyRango/:rangoId", [validarJWT], destroyRango);

module.exports = router;

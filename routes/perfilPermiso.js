const { Router } = require("express");
const { bajaPerfilPermiso } = require("../controllers/perfilPermiso");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT]);

router.put(
  "/bajaPerfilPermiso/:perfilPermisoId",
  [validarJWT],
  bajaPerfilPermiso
);

module.exports = router;

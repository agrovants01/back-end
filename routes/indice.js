const { Router } = require("express");
const {
  indiceAdminGET,
  indicePutIndice,
  indiceDelete,
  indicesGet,
  j,
  google,
  indiceFullPost,
  getFull,
  bajaIndice,
} = require("../controllers/indice");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

/*router.post('/', [

], indicePost)*/

router.delete("/:indiceId", [validarJWT], indiceDelete);

router.get("/", [validarJWT], indicesGet);

router.get("/newman", [validarJWT], j);

router.post("/google", [validarJWT], google);

router.post("/", [validarJWT], indiceFullPost);

router.get("/getFull/:usuarioId", [validarJWT], getFull);

router.get("/admin", [validarJWT], indiceAdminGET);

router.put("/:indiceId", [validarJWT], indicePutIndice);

router.delete("/indiceDelete/:indiceId", [], bajaIndice);

module.exports = router;

const { Router } = require("express");
const {
  perfilPost,
  getPerfiles,
  bajaPerfil,
} = require("../controllers/perfil");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [], perfilPost);

router.get("/", [], getPerfiles);

router.put("/bajaPerfil/:perfilId", bajaPerfil);

module.exports = router;

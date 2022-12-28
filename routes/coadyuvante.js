const { Router } = require("express");
const {
  coadyuvantePost,
  bajaCoadyuvante,
} = require("../controllers/coadyuvante");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT], coadyuvantePost);

router.delete("/bajaCoadyuvante/:coadyuvanteId", [validarJWT], bajaCoadyuvante);

module.exports = router;

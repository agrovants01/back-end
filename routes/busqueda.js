const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");

const { buscarPropietarios } = require("../controllers/busqueda");

const router = Router();

router.get(
  "/propietarios/",
  [
    validarJWT,
    //validarJWT
  ],
  buscarPropietarios
);

module.exports = router;

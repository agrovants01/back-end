const { Router } = require("express");
const { check } = require("express-validator");
const e = require("..//error/error");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  emailExiste,
  existeUsuarioPorEmail,
} = require("../helpers/db-validators");
const {
  usuarioPost,
  login,
  usuarioGet,
  usuarioGetById,
  usuarioPut,
  usuarioPutContrasenia,
  resetPass,
  requestResetPass,
  requestChangeMail,
  confirmMail,
  usuarioGetAdminList,
  getPropietariosInput,
  usuarioDelete,
  usuarioGetToken,
  validarPassword
} = require("../controllers/usuario");

//Middlewares
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/",
  [
    check("nombreUsuario", "el campo es obligatorio").not().isEmpty(),
    check("nombreUsuario", e.noVacio("nombreUsuario")).not().isEmpty(),
    check("nombreUsuario", e.longitud("nombreUsuario")).isLength({
      min: 2,
      max: 50,
    }),
    check("nombreUsuario", e.CaracteresValidos("nombreUsuario")).isAlphanumeric(
      "es-ES",
      { ignore: " " }
    ),
    check("apellidoUsuario", e.noVacio("apellidoUsuario")).not().isEmpty(),
    check("apellidoUsuario", e.longitud("apellidoUsuario")).isLength({
      min: 2,
      max: 50,
    }),
    check(
      "apellidoUsuario",
      e.CaracteresValidos("apellidoUsuario")
    ).isAlphanumeric("es-ES", { ignore: " " }),
    check("emailUsuario", e.noVacio("emailUsuario")).not().isEmpty(),
    check("emailUsuario", e.formatoEmail("emailUsuario")).isEmail(),
    check("emailUsuario").custom(emailExiste),
    check("telefonoUsuario", e.longitudMayor("telefonoUsuario", 7)).isLength({
      min: 7,
    }),
    check(
      "telefonoUsuario",
      "El teléfono solo puede contener números"
    ).isNumeric(),
    validarCampos,
  ],
  usuarioPost
);

router.post("/login", [], login);

router.post("/validar-pass", [validarJWT], validarPassword);

router.get("/", [], usuarioGet);

router.get("/auth", [validarJWT], usuarioGetToken);

/* router.get("/", function (req, res) {
  res.send("Hello world!");
}); */

router.put(
  "/editUsuario/:usuarioId",
  [
    validarJWT,
    check("nombreUsuario", "el campo es obligatorio").not().isEmpty(),
    check("nombreUsuario", e.noVacio("nombreUsuario")).not().isEmpty(),
    check("nombreUsuario", e.longitud("nombreUsuario")).isLength({
      min: 2,
      max: 50,
    }),
    check("nombreUsuario", e.CaracteresValidos("nombreUsuario")).isAlphanumeric(
      "es-ES",
      { ignore: " " }
    ),
    check("apellidoUsuario", e.noVacio("apellidoUsuario")).not().isEmpty(),
    check("apellidoUsuario", e.longitud("apellidoUsuario")).isLength({
      min: 2,
      max: 50,
    }),
    check(
      "apellidoUsuario",
      e.CaracteresValidos("apellidoUsuario")
    ).isAlphanumeric("es-ES", { ignore: " " }),
    check("telefonoUsuario", e.longitudMayor("telefonoUsuario", 7)).isLength({
      min: 7,
    }),
    check(
      "telefonoUsuario",
      "El teléfono solo puede contener números"
    ).isNumeric(),
    validarCampos,
  ],
  usuarioPut
);

router.put("/editContrasenia/:usuarioId", [validarJWT], usuarioPutContrasenia);

router.post("/requestResetPass", [], requestResetPass);

router.post("/resetPass", [], resetPass);

router.post("/requestChangeMail", [
  validarJWT,
  check("emailUsuario", e.noVacio("emailUsuario")).not().isEmpty(),
  check("emailUsuario", e.formatoEmail("emailUsuario")).isEmail(),
  check("emailUsuario").custom(emailExiste),
  validarCampos,
], requestChangeMail);

router.post("/changeMail", [], confirmMail);

router.get("/admin", [validarJWT], usuarioGetAdminList);

router.get("/admin/propietariosInput", [validarJWT], getPropietariosInput);

router.delete("/:usuarioId", [validarJWT], usuarioDelete);

router.get("/:usuarioId", [validarJWT], usuarioGetById);

module.exports = router;

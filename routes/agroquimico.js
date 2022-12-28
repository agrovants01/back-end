const { Router } = require("express");
const {
  agroquimicoPost,
  bajaAgroquimico,
} = require("../controllers/agroquimico");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", [validarJWT], agroquimicoPost);

router.delete("/bajaAgroquimico/:agroquimicoId", [validarJWT], bajaAgroquimico);

module.exports = router;

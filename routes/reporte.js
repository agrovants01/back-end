const { Router } = require("express");
const { reporteVuelo, reporte } = require("../controllers/reporte");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post("/vuelosReporte", [validarJWT], reporteVuelo);

router.post("/reporte", [validarJWT], reporte);

module.exports = router;

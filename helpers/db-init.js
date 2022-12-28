const sequelize = require("../database/config");
const nanoid = require("nanoid");
const Perfil = require("../model/perfil");

/*Al iniciar la base datos(creación), se crea por defecto un perfil ADMIN, que si ya existe dicho perfil esta 
        acción no se realiza*/

const dbInit = sequelize
  .sync({ force: false })
  .then(async () => {
    const existePerfil = await Perfil.findOne({
      where: { nombrePerfil: "ADMIN" || "Admin" || "admin" },
    });
    if (existePerfil) {
      console.log(`El perfil ADMIN ya existe`);
    } else {
      const newPerfil = new Perfil({
        perfilId: nanoid.nanoid(),
        nombrePerfil: "ADMIN",
        codigoPerfil: "1",
      });
      await newPerfil.save();
    }
    const existePerfil1 = await Perfil.findOne({
      where: { nombrePerfil: "PROPIETARIO" || "Propietario" || "propietario" },
    });
    if (existePerfil1) {
      console.log(`El perfil PROPIETARIO ya existe`);
    } else {
      const newPerfil = new Perfil({
        perfilId: nanoid.nanoid(),
        nombrePerfil: "PROPIETARIO",
        codigoPerfil: "2",
      });
      await newPerfil.save();
    }

    console.log("Nos hemos conectado a la base de datos");
  })
  .catch((error) => {
    console.log("Se ha producido un error", error);
  });

module.exports = dbInit;

const Perfil = require("./model/perfil");
const Permiso = require("./model/permiso");
const PerfilPermiso = require("./model/perfilPermiso");
const Usuario = require("./model/usuario");
const Analisis = require("./model/analisis");
const Vuelo = require("./model/vuelo");
const Observacion = require("./model/observacion");
const Indice = require("./model/indice");
const Agroquimico = require("./model/agroquimico");
const Coadyuvante = require("./model/coadyuvante");
const Rango = require("./model/rango");
const Marcador = require("./model/marcador");

//asociación 1 a N entre permiso(1) y perfilPermiso(N), en donde permiso tiene la clave foránea
Permiso.hasMany(PerfilPermiso, { foreignKey: "fk_Permiso" });
PerfilPermiso.belongsTo(Permiso, { foreignKey: "fk_Permiso" });

//asociación 1 a N entre perfil(1) y perfilPermiso(N), en donde permiso tiene la clave foránea
Perfil.hasMany(PerfilPermiso, { foreignKey: "fk_Perfil" });
PerfilPermiso.belongsTo(Perfil, { foreignKey: "fk_Perfil" });

//asociación 1 a N entre perfil(1) y usuario(N), en donde usuario tiene la clave foránea
Perfil.hasMany(Usuario, { foreignKey: "fk_Perfil" });
Usuario.belongsTo(Perfil, { foreignKey: "fk_Perfil" });

//asociación 1 a N entre usuario(1) y analisis(N), en donde analisis usuario tiene la clave foránea
Usuario.hasMany(Analisis, { foreignKey: "fk_Usuario" });
Analisis.belongsTo(Usuario, { foreignKey: "fk_Usuario" });

//asociación 1 a N entre usuario(1) y vuelo(N), en donde vuelo tiene la clave foránea
Usuario.hasMany(Vuelo, { foreignKey: "fk_Usuario" });
Vuelo.belongsTo(Usuario, { foreignKey: "fk_Usuario" });

//asociación 1 a N entre usuario(1) y observacion(N), en donde observacion tiene la clave foránea
Usuario.hasMany(Observacion, { foreignKey: "fk_Usuario" });
Observacion.belongsTo(Usuario, { foreignKey: "fk_Usuario" });

//asociación 1 a N entre analisis(1) y indice(N), en donde indice tiene la clave foránea
Indice.hasMany(Analisis, { foreignKey: "fk_Indice" });
Analisis.belongsTo(Indice, { foreignKey: "fk_Indice" });

//asociación 1 a N entre analisis(1) y indice(N), en donde indice tiene la clave foránea
Indice.hasMany(Rango, { foreignKey: "fk_Indice" });
Rango.belongsTo(Indice, { foreignKey: "fk_Indice" });

//asociación 1 a N entre usuario(1) y observacion(N), en donde observacion tiene la clave foránea
Vuelo.hasMany(Agroquimico, { foreignKey: "fk_Vuelo" });
Agroquimico.belongsTo(Vuelo, { foreignKey: "fk_Vuelo" });

//asociación 1 a N entre usuario(1) y observacion(N), en donde observacion tiene la clave foránea
Vuelo.hasMany(Coadyuvante, { foreignKey: "fk_Vuelo" });
Coadyuvante.belongsTo(Vuelo, { foreignKey: "fk_Vuelo" });

//asociación 1 a N entre usuario(1) y observacion(N), en donde observacion tiene la clave foránea
Observacion.hasMany(Marcador, { foreignKey: "fk_Observacion" });
Marcador.belongsTo(Observacion, { foreignKey: "fk_Observacion" });

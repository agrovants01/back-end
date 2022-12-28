//Importaciones necesarias
const express = require("express");
const path = require("path");
const cors = require("cors");
require("../associations");
const dbinit = require("../helpers/db-init");

// Allowed extensions list can be extended depending on your own needs
class Server {
  /*se crean las rutas a utilizar para las distintas clases*/
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuario";
    this.agroquimicosPath = "/api/agroquimico";
    this.indicesPath = "/api/indice";
    this.rangosPath = "/api/rango";
    this.filesPath = "/api/file";
    this.observacionesPath = "/api/observacion";
    this.analisisPath = "/api/analisis";
    this.vuelosPath = "/api/vuelo";
    this.busquedaPath = "/api/busqueda";
    this.reportesPath = "/api/reporte";
    this.perfilesPath = "/api/perfil";

    //this.app.get('/api', (req, res) => res.json({ application: 'app' })); //Captura de todas las request del back

    // Conectar a base de datos
    //this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  // async conectarDB() {
  //     await dbConnection();
  // }

  middlewares() {
    //lista de los dominios bloqueados
    const blacklist = ["http://localhost:3001", "http://localhost:3002"];
    const corsOptions = {
      origin: function (origin, callback) {
        //este origin es para probar desde el postman
        if (blacklist.indexOf(origin) == -1 || origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };

    // CORS
    //this.app.use(cors(corsOptions));
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuario"));
    this.app.use(this.agroquimicosPath, require("../routes/agroquimico"));
    this.app.use(this.indicesPath, require("../routes/indice"));
    this.app.use(this.filesPath, require("../routes/file"));
    this.app.use(this.observacionesPath, require("../routes/observacion"));
    this.app.use(this.analisisPath, require("../routes/analisis"));
    this.app.use(this.vuelosPath, require("../routes/vuelo"));
    this.app.use(this.busquedaPath, require("../routes/busqueda"));
    this.app.use(this.reportesPath, require("../routes/reporte"));
    this.app.use(this.perfilesPath, require("../routes/perfil"));
    this.app.use(this.rangosPath, require("../routes/rango"));

    //Redireccionamos todas las otras rutas al front end
    const allowedExt = [
      '.js',
      '.ico',
      '.css',
      '.png',
      '.jpg',
      '.woff',
      '.woff',
      '.tff',
      '.svg',
      '.svg',
      'gif'
    ];

    this.app.get('*', (req, res) => {
      if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve(process.cwd() + `/public/front-end/${req.url}`));
      } else {
        res.sendFile(path.join(process.cwd() + "/public/front-end/index.html"));
      }
    });
  }

  //Se indica el puerto en donde está corriendo la aplicación
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });

    /*Al iniciar la base datos(creación), se crea por defecto un perfil ADMIN, que si ya existe dicho perfil esta 
        acción no se realiza*/

    // Se llama al objeto que inicializa las clases necesarias como los perfiles y permisos al iniciar la base de datos
    dbinit;
  }
}

module.exports = Server;

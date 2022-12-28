//Importaciones de librerías y clases necesarias
const { request, response } = require("express");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const nanoid = require("nanoid");
const moment = require("moment");
const Usuario = require("../model/usuario");
const Perfil = require("../model/perfil");
const { generarJWT } = require("../helpers/generar-jwt");
const _ = require("lodash");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Analisis = require("../model/analisis");
const Vuelo = require("../model/vuelo");
const Observacion = require("../model/observacion");
//Se crea un usuario a través de una solicitud "post" enviando en el body de la solicitud los parametros necesarios.
const usuarioPost = async (req = request, res = response) => {
  //console.log("BODY", req.body);
  try {
    const newUsuario = new Usuario({
      usuarioId: nanoid.nanoid(),
      nombreUsuario: req.body.nombreUsuario,
      apellidoUsuario: req.body.apellidoUsuario,
      emailUsuario: req.body.emailUsuario,
      contraseniaUsuario: nanoid.nanoid(8),
      telefonoUsuario: req.body.telefonoUsuario,
      cuitUsuario: req.body.cuitUsuario,
      aliasUsuario: req.body.aliasUsuario,
      fk_Perfil: req.body.perfilUsuario,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "agrovantsbackup@gmail.com",
        pass: "9JI7@o6ghXs5",
      },
    });

    const data = {
      from: "agrovantsbackup@gmail.com",
      to: newUsuario.emailUsuario,
      subject: "Contraseña de usuario para AgroVants",
      html:
        `<div style="width:500px; min-height:400px; margin:0 auto; background-color:#112724; color:white; font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif; padding:40px">
                <img height="32" src="https://gotaprotegida.com/wp-content/uploads/2020/10/AGROVANTS2.png" alt="AgroVants">
                    <div style="text-align:center; margin-top: 20px;">
                    <div style="font-weight:bold; font-size:24px; margin-bottom: 10px; margin-top: 50px;">` +
        "Hola " +
        newUsuario.emailUsuario +
        `</div>
                        <div style="font-size:20px;">` +
        "Su contraseña para AgroVants es: " +
        newUsuario.contraseniaUsuario +
        ` </div>
                    </div>
                </div>`,
    };

    transporter.sendMail(data, function (error, info) {
      if (error) {
        console.log(error);
        res.send(500, err.message);
      } else {
        console.log("Email enviado");
        res.status(200).json(req.body);
      }
    })

    const salt = bcryptjs.genSaltSync();
    newUsuario.contraseniaUsuario = bcryptjs.hashSync(
      newUsuario.contraseniaUsuario,
      salt
    );

    const token = JWT.sign(
      { id: newUsuario.usuarioId },
      process.env.SECRETORPRIVATEKEY
    );
    await newUsuario.save();

    res.json({ token: token });
  } catch (error) {
    //res.json({msg: "hay un error"})
    console.error(error);
  }
};

/*Al momento de iniciar sesión al usuario se le asigna un token temporal con el fin de corroborar que el usuario
no haya sido alterado*/
const login = async (req, res = response) => {
  const { emailUsuario, contraseniaUsuario } = req.body;

  try {
    const u = await Usuario.findOne({
      where: {
        emailUsuario: req.body.emailUsuario,
      },
    });
    let perfilId;
    let perfilUsuario;
    let Idusuario;
    if (u) {
      Idusuario = u.usuarioId;
      const perfil = await Perfil.findOne({
        where: {
          perfilId: u.fk_Perfil,
        },
      });
      perfilId = u.usuarioId;
      perfilUsuario = perfil.nombrePerfil;
    }
    // Verificar si el email existe
    const usuario = await Usuario.findOne({
      where: { emailUsuario: emailUsuario },
    });
    if (usuario === null || usuario.emailUsuario !== emailUsuario) {
      return res.status(400).json({
        msg: "El correo no existe",
      });
    }

    // SI el usuario está activo
    if (usuario.fechaBajaUsuario !== null) {
      return res.status(400).json({
        msg: "El usuario está dado de baja",
      });
    }

    // Verificar la contraseña
    const validContraseniaUsuario = bcryptjs.compareSync(
      contraseniaUsuario,
      usuario.contraseniaUsuario
    );

    if (validContraseniaUsuario === false) {
      return res.status(400).json({
        msg: "La contraseña ingresada es incorrecta",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.usuarioId);

    // Actualizo la fecha del ultimo login
    const userUpdated = await Usuario.update(
      {
        lastLoginDate: moment(new Date(), "DD-MM-YYYY"),
        tokenSession: token,
      },
      {
        where: {
          usuarioId: usuario.usuarioId,
        },
        returning: true,
        plain: true,
      }
    );

    const userId = userUpdated.usuarioId;
    res.json({ token, perfilUsuario, userId, Idusuario });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

//Validar Contraseña
const validarPassword = async (req = request, res = response) => {
  const { contraseniaUsuario, usuarioId } = req.body;
  try {

    const usuario = await Usuario.findOne({
      where: {
        fechaBajaUsuario: null,
        usuarioId: usuarioId
      },
    });

    // Verificar la contraseña
    const validContraseniaUsuario = bcryptjs.compareSync(
      contraseniaUsuario,
      usuario.contraseniaUsuario
    );

    if (validContraseniaUsuario === false) {
      return res.json(false)
    }

    res.json(true)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'No se pudo encncontrar el usuario solicitado'
    });
  }


}

//getAll usuarios
const usuarioGet = async (req = request, res = response) => {
  try {
    const usuario = await Usuario.findAll({
      where: {
        fechaBajaUsuario: null,
      },
    });
    res.json(usuario);
  } catch (error) {
    console.error(error);
  }
};

//get usuario por token
const usuarioGetToken = async (req = request, res = response) => {
  const { usuarioId, fk_Perfil, ...user } = req.usuario;
  try {
    const perfilUsuario = await Perfil.findOne({
      where: {
        perfilId: fk_Perfil,
        fechaBajaPerfil: null,
      },
    });
    const usuarioAuth = {
      usuarioId,
      perfilUsuario: perfilUsuario.nombrePerfil,
    };
    res.json(usuarioAuth);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la autenticación de usuarios, ver logs",
    });
  }
};

//getOne usuario
const usuarioGetById = async (req = request, res = response) => {
  try {
    console.log(req.params);
    const usuario = await Usuario.findOne({
      where: {
        usuarioId: req.params.usuarioId,
      },
      attributes: [
        "usuarioId",
        "nombreUsuario",
        "apellidoUsuario",
        "aliasUsuario",
        "cuitUsuario",
        "telefonoUsuario",
        "emailUsuario"
      ],
    });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      msg: 'No se ha encontrado el usuario, revisar logs'
    })
  }
};

//modificación de nombre, apellido, alias y/o teléfono
const usuarioPut = async (req = request, res = response) => {
  try {
    //Obtenemos el id del usuario
    const perfilUsuario = await Usuario.findOne({
      where: {
        usuarioId: req.params.usuarioId
      },
      attributes: ['fk_Perfil']
    })
    //Se genera el usuario a guardar
    const userObj = {
      nombreUsuario: req.body.nombreUsuario ? req.body.nombreUsuario : null,
      apellidoUsuario: req.body.apellidoUsuario
        ? req.body.apellidoUsuario
        : null,
      telefonoUsuario: req.body.telefonoUsuario
        ? req.body.telefonoUsuario
        : null,
      aliasUsuario: req.body.aliasUsuario ? req.body.aliasUsuario : null,
      emailUsuario: req.body.emailUsuario ? req.body.emailUsuario : null,
      fk_Perfil: perfilUsuario.fk_perfil,
    };

    // Se limpia el objeto quitando los null para que no se actualicen
    const userObjClean = Object.fromEntries(
      Object.entries(userObj).filter(([_, v]) => v != null)
    );

    //console.log(userObjClean);

    const updatedUsuario = await Usuario.update(userObjClean, {
      where: {
        usuarioId: req.params.usuarioId,
      },
      returning: true,
      plain: true,
    });
    res.json(updatedUsuario[1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al modificar el usuario, ver logs'
    });
  }
};

//cambio de contraseña dentro del sitio
const usuarioPutContrasenia = async (req = request, res = response) => {
  try {
    const salt = bcryptjs.genSaltSync();

    const updatedUsuario = await Usuario.findOne({
      where: {
        usuarioId: req.params.usuarioId,
      },
    });
    updatedUsuario.contraseniaUsuario = req.body.contraseniaUsuario;
    updatedUsuario.contraseniaUsuario = bcryptjs.hashSync(
      req.body.contraseniaUsuario,
      salt
    );
    updatedUsuario.save();
    res.json(updatedUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al modificar contraseña, ver logs' });
  }
};

//Correo de confirmación al nuevo email
const requestChangeMail = async (req = request, res = response) => {
  const usuario = req.usuario;
  const newEmail = req.body.emailUsuario;
  /*const usuario = await Usuario.findOne({
    where: {
      emailUsuario: req.body.oldEmail,
    },
  });

  if (usuario === null || usuario.emailUsuario !== req.body.oldEmail) {
    return res.status(400).json({
      msg: "No existe un usuario asociado al email ingresado",
    });
  }*/
  if (usuario === null) {
    return res.status(400).json({
      msg: "No existe el usuario solicitado",
    });
  }
  try {


    const token = JWT.sign(
      { id: usuario.usuarioId },
      process.env.RESET_PASSWORD_KEY,
      { expiresIn: "20m" }
    );

    const updatedUsuario = await Usuario.update(
      {
        resetLink: token,
        emailUsuario: newEmail,
      },
      {
        where: {
          usuarioId: usuario.usuarioId,
        },
        returning: true,
        plain: true,
      }
    );

    res.json({ usuario: updatedUsuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al actualizar el email del usuario",
    });
  }
};

// Se cambia el email del usuario desde el link del correo
const confirmMail = async (req = request, res = response) => {
  const { resetLink, emailUsuario } = req.body;

  if (resetLink) {
    JWT.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (error, decodedData) => {
        if (error) {
          return res.status(401).json({
            error: "Este token es incorrecto o ya ha expirado",
          });
        }

        let usuario = await Usuario.findOne({
          where: { resetLink: resetLink },
        });

        if (usuario === null || usuario.resetLink !== resetLink) {
          return res.status(400).json({
            msg: "No existe un usuario asociado al token",
          });
        }

        const obj = {
          emailUsuario: emailUsuario,
        };

        usuario = _.extend(usuario, obj);

        try {
          await usuario.save();

          return res.status(200).json({
            msg: "El email ha sido cambiado con exito",
          });
        } catch (err) {
          return res.status(400).json({
            msg: "Error al cambiar el email",
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      msg: "Error de autenticacion",
    });
  }
};

// Envia un correo de recuperacion de contraseña
const requestResetPass = async (req = request, res = response) => {
  const usuario = await Usuario.findOne({
    where: { emailUsuario: req.body.emailUsuario },
  });

  if (usuario === null || usuario.emailUsuario !== req.body.emailUsuario) {
    return res.status(400).json({
      msg: "No existe un usuario asociado al email ingresado",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "agrovantsbackup@gmail.com",
      pass: "9JI7@o6ghXs5",
    },
  });

  const token = JWT.sign(
    { id: usuario.usuarioId },
    process.env.RESET_PASSWORD_KEY,
    { expiresIn: "20m" }
  );

  const data = {
    from: "agrovantsbackup@gmail.com",
    to: usuario.emailUsuario,
    subject: "Link para el cambio de contraseña",
    html:
      `<div style="width:500px; min-height:400px; margin:0 auto; background-color:#112724; color:white; font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif; padding:40px">
        <img height="32" src="https://gotaprotegida.com/wp-content/uploads/2020/10/AGROVANTS2.png" alt="AgroVants">
            <div style="text-align:center; margin-top: 20px;">
            <div style="font-weight:bold; font-size:24px; margin-bottom: 10px; margin-top: 50px;">` +
      "Acceda al siguiente link para el cambio de contraseña" +
      `</div>
                <a href="http://localhost:4200/auth/change-pass/${token}">${process.env.CLIENT_URL}/auth/change-pass/${token}</a>  
            </div>
        </div>`,
  };

  transporter.sendMail(data, function (error, info) {
    if (error) {
      console.log(error, "errorsinho");
      res.status(500).send(error.message);
    } else {
      console.log("Email enviado");
      res.status(200).json(req.body);
    }
  });
  const updatedUsuario = await Usuario.update(
    {
      resetLink: token,
    },
    {
      where: {
        usuarioId: usuario.usuarioId,
      },
      returning: true,
      plain: true,
    }
  );
  res.json({ usuario: updatedUsuario });
};

// Se reinicia la contraseña del usuario desde el link del correo
const resetPass = async (req = request, res = response) => {
  const { resetLink, contraseniaUsuario } = req.body;

  if (resetLink) {
    JWT.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (error, decodedData) => {
        if (error) {
          return res.status(401).json({
            error: "Este token es incorrecto o ya ha expirado",
          });
        }
        let usuario = await Usuario.findOne({
          where: { resetLink: resetLink },
        });
        if (usuario === null || usuario.resetLink !== resetLink) {
          return res.status(400).json({
            msg: "No existe un usuario asociado al token",
          });
        }
        const salt = bcryptjs.genSaltSync();
        newPass = bcryptjs.hashSync(contraseniaUsuario, salt);
        const obj = {
          contraseniaUsuario: newPass,
        };
        usuario = _.extend(usuario, obj);

        try {
          await usuario.save();
          return res.status(200).json({
            msg: "La contraseña ha sido cambiada con exito",
          });
        } catch (err) {
          return res.status(400).json({
            msg: "Error al reiniciar contraseña",
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      msg: "Error de autenticacion",
    });
  }
};

const usuarioGetAdminList = async (req = request, res = response) => {
  //Capturamos el valor de búsqueda
  const parametroBusqueda = req.query.q.trim().toLocaleLowerCase();
  const order = [
    req.query.sort || "nombreUsuario",
    req.query.order.toUpperCase() || "ASC",
  ];
  const offset = req.query.page || 0;
  const limit = req.query.limit || 100;

  //Obtenemos el nombre/s y apellido/s del usuario
  const nombreApellido = parametroBusqueda.split(" ");
  let nombre = "";
  let apellido = "";

  if (nombreApellido.length > 2) {
    const [nombre1, nombre2, ...apellidos] = nombreApellido;
    nombre = nombre1 + nombre2;
    apellidos.forEach((a) => {
      apellido += a;
    });
  } else if (nombreApellido.length === 2) {
    const [nombre1, apellido1] = nombreApellido;
    nombre = nombre1;
    apellido = apellido1;
  } else {
    nombre = parametroBusqueda;
    apellido = parametroBusqueda;
  }

  try {
    //Obtenemos todos los usuarios
    const usuarios = await Usuario.findAndCountAll({
      include: [
        {
          model: Perfil,
          on: {
            fk_Perfil: sequelize.where(
              sequelize.col("Usuario.fk_Perfil"),
              "=",
              sequelize.col("Perfil.perfilId")
            ),
          },
          attributes: ["nombrePerfil"],
        },
      ],
      attributes: [
        "usuarioId",
        "nombreUsuario",
        "apellidoUsuario",
        "emailUsuario",
        "telefonoUsuario",
        "cuitUsuario",
        "aliasUsuario",
      ],
      where: {
        fechaBajaUsuario: null,
        [Op.or]: [
          {
            nombreUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("nombreUsuario")),
              "LIKE",
              "%" + nombre + "%"
            ),
          },
          {
            apellidoUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("apellidoUsuario")),
              "LIKE",
              "%" + apellido + "%"
            ),
          },
          {
            emailUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("emailUsuario")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
          {
            telefonoUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("telefonoUsuario")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
          {
            cuitUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("cuitUsuario")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
          {
            aliasUsuario: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("aliasUsuario")),
              "LIKE",
              "%" + parametroBusqueda + "%"
            ),
          },
        ],
      },
      order: [order],
      limit: limit,
      offset: offset * limit,
    });

    return res.json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la búsqueda de usuarios, ver logs",
    });
  }
};

const getPropietariosInput = async (req = request, res = response) => {
  try {
    const perfilPropietario = await Perfil.findOne({
      where: {
        nombrePerfil: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("nombrePerfil")),
          "LIKE",
          "%" + "propietario" + "%"
        ),
      },
    });
    if (!perfilPropietario) {
      return res.status(404).json({
        msg: "No se encuentra el perfil de Propietario",
      });
    }
    const { perfilId, ...perfil } = perfilPropietario;

    const propietarios = await Usuario.findAll({
      where: {
        fk_Perfil: perfilId,
      },
      attributes: [
        ["usuarioId", "propietarioId"],
        ["nombreUsuario", "nombrePropietario"],
        ["apellidoUsuario", "apellidoPropietario"],
        ["aliasUsuario", "aliasPropietario"],
      ],
    });
    res.json(propietarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la búsqueda de propietarios para input, ver logs",
    });
  }
};

const usuarioDelete = async (req = request, res = response) => {
  const usuarioId = req.params.usuarioId;
  try {
    //TODO: Ver como trabajar los vuelos al eliminar el usuario
    //Determinamos la fecha de baja del usuario
    const deletedUsuario = await Usuario.update(
      {
        fechaBajaUsuario: moment(new Date(), "DD-MM-YYYY"),
      },
      {
        where: {
          usuarioId: usuarioId,
        },
        returning: true,
        plain: true,
      }
    );

    const analisis = await Analisis.findAll({
      where: {
        fk_Usuario: usuarioId,
      },
    });

    for (i in analisis) {
      analisis[i].fechaBajaAnalisis = moment(new Date(), "DD-MM-YYYY");
      analisis[i].save();
    }

    const vuelos = await Vuelo.findAll({
      where: {
        fk_Usuario: usuarioId,
      },
    });

    for (i in vuelos) {
      vuelos[i].fechaBajaVuelo = moment(new Date(), "DD-MM-YYYY");
      vuelos[i].save();
    }

    const observaciones = await Observacion.findAll({
      where: {
        fk_Usuario: usuarioId,
      },
    });

    for (i in observaciones) {
      observaciones[i].fechaBajaObservacion = moment(new Date(), "DD-MM-YYYY");
      observaciones[i].save();
    }

    res.json({
      msg: "El usuario junto con sus análisis, observaciones y vuelos han sido eliminados",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Falla en la eliminación de usuarios, ver logs",
    });
  }
};

//Se exportan los métodos a utilizar
module.exports = {
  usuarioPost,
  login,
  usuarioGet,
  usuarioGetById,
  usuarioPut,
  usuarioPutContrasenia,
  requestChangeMail,
  confirmMail,
  requestResetPass,
  resetPass,
  usuarioGetAdminList,
  usuarioGetToken,
  getPropietariosInput,
  usuarioDelete,
  validarPassword
};

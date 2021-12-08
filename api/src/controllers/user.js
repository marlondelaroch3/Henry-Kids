const { User, Class } = require("../db.js");
const { sendMail } = require('../mails/mails')
const fs = require('fs')
// fs es una libreria, sistema de archivo, para interactuar con los archivos y directorios. (en este caso usamos ---> readFileSync())

// funcion para crear Usuario, tambien mediante sendMail enviamos un correo de bienvenida.
async function createUser(req, res, next) {

  const { firstName, lastName, userName, type, photo, email, password, id } =
    req.body;
    

  try {
   
    const user = await User.create({
      id,
      firstName,
      lastName,
      userName,
      type,
      photo,
      email,
      password
    });
    
    const newUser = await User.findOne({ where: { userName } });
    // aca le ponemos mayuscula a la primer letra del nombre.
    let newFirstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)

    // aca leemos el archivo html. y con el replace le decimos que cambie FIRST_NAME que se encuentra en el archivo, por el nosbre que se pasa por body firstName. (de esta forma hacemos el mail mas personal)
    let html_template = fs.readFileSync('./src/mails/templates/welcome.html', {encoding:'utf8', flag:'r'})
    html_template = html_template.replace('FIRST_NAME', newFirstName)

    //aca le pasamos a la funcion, el email del usuario, el asunto, el template, y si es html o text.
    sendMail(email, "Welcome to Henry Kids", html_template, "html");

    res.status(200).send(newUser);

  } catch {
    (err) => err(next);
  }
}

// funcion para traernos 1 Usuario por id.
async function getUserId(req, res, next) {
  try {
    const { id } = req.params;
    const userDetail = await User.findAll({
      where: {
        id: id,
      },
    });
    res.send(userDetail);
  } catch (error) {
    next(error);
  }
}

// funcion para poder eliminar un Usuario mediante el id.
async function deleteUser(req, res, next) {
  try {
    const deleUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send("Was successfully removed");
  } catch (err) {
    next(err);
  }
}

// funcion para editar un Usuario mediante el id.
async function editUser(req, res, next) {
  const changes = req.body;
  try {
    const result = await User.update(changes, {
      where: {
        id: req.params.id,
      },
    });

    res.send("Was successfully edited");
  } catch (err) {
    next(err);
  }
}

// funcion para traernos todos los users.
async function getUser(req, res, next) {
  if (req.query.title) {
    return User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "userName",
        "type",
        "photo",
        "email",
        "password",
      ],
      where: {
        title: {
          [Op.iLike]: `%${req.query.title}%`,
        },
        include: { model: Class },
      },
    }).then((User) => {
      if (User.length === 0) {
        return res.send("Not class found");
      }
      res.send(User);
    });
  } else {
    return User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "userName",
        "type",
        "photo",
        "email",
        "password",
      ],
    }).then((User) => {
      res.send(User);
    });
  }
}

// funcion para traernos un user por tipo de id.
async function getTipo(req,res,next){
  try {
    const { id } = req.params;
    const userDetail = await User.findAll({
      where: {
        id: id,
      },
    });
    const aux=userDetail[0].dataValues.type
    res.send(aux);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUserId,
  getUser,
  editUser,
  deleteUser,
  getTipo
};

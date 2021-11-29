const {
  User,
  Class,
  Category,
  Recommendation,
  Comment,
  Evaluation,
} = require("../db");
const Sequelize = require("sequelize");

async function relClassUser(req, res, next) {
  // res.send({ mensage: "No existe un usuario con ese nombre" })

  try {
    const { idUs, idClas } = req.params;
    const user = await User.findByPk(idUs);
    user.addClass(idClas, { as: "student" });
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

async function getAlu(req, res, next) {
  const favoritos = await User.findAll({
    where: {
      id: req.params.idUs,
      type: "student",
    },
    include: Class,
  });
  res.status(200).send(favoritos);
}

async function getProf(req,res,next){
  const cursos = await User.findAll({
    where: {
      id: req.params.idUs,
      type: "teacher",
    },
    include: Class,
  });
  res.status(200).send(cursos);
}

module.exports = {
  relClassUser,
  getAlu,
  getProf
};
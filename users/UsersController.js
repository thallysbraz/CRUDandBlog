const express = require("express");
const bcrypt = require("bcryptjs");

//Model de User
const User = require("./User");

const router = express.Router();

//rota pra listar os usuários
router.get("/users", (req, res) => {
  User.findAll({
    order: [["id", "DESC"]]
  })
    .then(users => {
      res.render("admin/users/index", { users: users });
    })
    .catch(error => {
      // se der erro interno, mostra json ao usuário com o erro.
      res.status(404).json({
        msg: "Error interno ao buscar os usuário",
        error: error
      });
    });
});

//rota para view de adicionar usuários
router.get("/users/create", (req, res) => {
  res.render("admin/users/create");
});
//rota com method=post para salvar user no BD
router.post("/users/create", (req, res) => {
  try {
    var { email, password } = req.body; // recebendo dados do form
    var salt = bcrypt.genSaltSync(10); // Salt para "aumentar" a segurança da criptografia
    var hash = bcrypt.hashSync(password, salt); // cryptografando a senha

    //verificando se email está definido
    if (email == undefined) {
      res.redirect("/admin/users/create");
    }
    //verificando se senha está definida
    else if (password == undefined) {
      res.redirect("/admin/users/create");
    }

    //verificando se user ja é cadastrado

    User.findOne({ where: { email: email } })
      .then(user => {
        // se encontrar algum email, redireciona o usuário para o form
        if (user) {
          res.redirect("/admin/users/create");
        }
        // se não encontrar salva user no Banco de Dados
        else {
          //Salvando user no Banco
          User.create({
            email: email,
            password: hash
          })
            .then(() => {
              res.redirect("/");
            })
            .catch(error => {
              // se der erro interno, mostra json ao usuário com o erro.
              res.status(404).json({
                msg: "Error interno ao salvar usuário",
                error: error
              });
            });
        }
      })
      .catch(error => {
        // se der erro interno, mostra json ao usuário com o erro.
        res.status(404).json({
          msg: "Error interno ao validar o usuário",
          error: error
        });
      });
  } catch (error) {
    res.redirect("/");
  }
});

module.exports = router;

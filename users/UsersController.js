const express = require("express");
const bcrypt = require("bcryptjs");

//Model de User
const User = require("./User");

//Middleware
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

//rota pra listar os usuários
router.get("/users", adminAuth, (req, res) => {
  User.findAll({
    order: [["id", "ASC"]]
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
router.get("/users/create", adminAuth, (req, res) => {
  res.render("admin/users/create");
});

//rota com method=post para salvar user no BD
router.post("/users/create", adminAuth, (req, res) => {
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

//rota de renderizar view de login
router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

//rota pra fazer o login
router.post("/authenticate", (req, res) => {
  var { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then(user => {
      if (user) {
        // se encontrou algum usuário, faz a validação
        var correct = bcrypt.compareSync(password, user.password); // comparando senha

        if (correct) {
          // se a senha bater, cria sessão de usuário
          req.session.user = {
            id: user.id,
            email: user.email
          };
          res.redirect("/articles/admin");
        } else {
          // se a senha não bater
          res.redirect("/admin/login");
        }
      } else {
        // se não encontrou, redireciona pra view de login novamente
        res.redirect("/admin/login");
      }
    })
    .catch(error => {
      // se der erro interno, mostra json ao usuário com o erro.
      res.status(404).json({
        msg: "Error interno ao authenticar usuário",
        error: error
      });
    });
});

module.exports = router;

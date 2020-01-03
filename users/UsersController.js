const express = require("express");
const bcrypt = require("bcryptjs");

//Model de User
const User = require("./User");

const router = express.Router();

//rota pra listar os usuários
router.get("/users", (req, res) => {
  res.send("User list");
});

//rota para view de adicionar usuários
router.get("/users/create", (req, res) => {
  res.render("admin/users/create");
});
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

    //Salvando user no Banco
    User.create({
      email: email,
      password: hash
    })
      .then(() => {
        res.redirect("/admin/users/create");
      })
      .catch(error => {
        // se der erro interno, mostra json ao usuário com o erro.
        res.status(404).json({
          msg: "Error interno ao salvar usuário",
          error: error
        });
      });
  } catch (error) {
    res.redirect("/");
  }
});

module.exports = router;
